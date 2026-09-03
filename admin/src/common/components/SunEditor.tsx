"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import suneditor from "suneditor";
import en from "suneditor/langs/en";
import {
  align,
  backgroundColor,
  blockquote,
  blockStyle,
  font,
  fontColor,
  fontSize,
  hr,
  image,
  link,
  list,
  list_bulleted,
  list_numbered,
  paragraphStyle,
  table,
  video,
} from "suneditor/plugins";
import "suneditor/css/editor";
import "suneditor/css/contents";

import imageService from "../service/image.service";
import { API_URL } from "@/config/api";

const editorPlugins = {
  align,
  backgroundColor,
  blockquote,
  blockStyle,
  font,
  fontColor,
  fontSize,
  hr,
  image,
  link,
  list,
  list_bulleted,
  list_numbered,
  paragraphStyle,
  table,
  video,
};

interface SunEditorProps {
  blogData: string;
  setBlogData: (value: string) => void;
  variant?: "full" | "compact";
}

const resolveEditorImageUrl = (url: string): string => {
  const normalizedUrl = url.trim();
  const localUploadMatch = normalizedUrl.match(
    /^(?:https?:\/\/uploads|\/\/uploads|\/uploads|uploads)(\/.*)$/i,
  );
  if (!localUploadMatch) return normalizedUrl;

  const uploadPath = `/uploads${localUploadMatch[1]}`;

  try {
    return `${new URL(API_URL).origin}${uploadPath}`;
  } catch {
    return uploadPath;
  }
};

const base64ImageToFile = (dataUrl: string, index: number): File => {
  const match = dataUrl.match(
    /^data:(image\/[a-zA-Z0-9.+-]+);base64,([\s\S]+)$/,
  );
  if (!match) throw new Error("Invalid base64 image data");

  const mimeType = match[1].toLowerCase();
  const binary = window.atob(match[2].replace(/\s/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let byteIndex = 0; byteIndex < binary.length; byteIndex += 1) {
    bytes[byteIndex] = binary.charCodeAt(byteIndex);
  }

  const extensionByMime: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "image/bmp": "bmp",
  };
  const extension = extensionByMime[mimeType] || mimeType.split("/")[1] || "png";

  return new File(
    [bytes],
    `pasted-image-${Date.now()}-${index}.${extension}`,
    { type: mimeType },
  );
};

const restoreImageSizeMetadata = (html: string): string => {
  if (!html || typeof DOMParser === "undefined") return html;

  const document = new DOMParser().parseFromString(html, "text/html");
  document.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
    const source = image.getAttribute("src");
    if (source) image.setAttribute("src", resolveEditorImageUrl(source));

    if (image.hasAttribute("data-se-size")) return;

    const widthAttribute = image.getAttribute("width")?.trim() ?? "";
    const heightAttribute = image.getAttribute("height")?.trim() ?? "";
    const width =
      image.style.width ||
      (widthAttribute && widthAttribute !== "auto"
        ? `${widthAttribute.replace(/px$/i, "")}px`
        : "auto");
    const height =
      image.style.height ||
      (heightAttribute && heightAttribute !== "auto"
        ? `${heightAttribute.replace(/px$/i, "")}px`
        : "auto");

    image.setAttribute("data-se-size", `${width},${height}`);
    if (!image.style.width && width !== "auto") image.style.width = width;
    if (!image.style.height && height !== "auto") image.style.height = height;
  });

  return document.body.innerHTML;
};

const applyStoredImageSizes = (root: HTMLElement): void => {
  root.querySelectorAll<HTMLImageElement>(".se-image-container img").forEach((image) => {
    const [storedWidth = "", storedHeight = ""] = (
      image.getAttribute("data-se-size") || ""
    ).split(",");
    const container = image.closest<HTMLElement>(".se-image-container");
    const figure = image.closest<HTMLElement>("figure");
    if (!container || !storedWidth) return;
    const isCentered = container.classList.contains("__se__float-center");

    if (storedWidth.endsWith("%")) {
      // SunEditor's center-selection lifecycle copies container.style.width
      // back to the figure. Keep the resized value there and use min-width for
      // the full alignment row; setting width=100% makes the next image
      // selection expand the previous centered image.
      container.style.width = storedWidth;
      container.style.minWidth = isCentered ? "100%" : "";
      if (figure) figure.style.width = isCentered ? storedWidth : "100%";
      image.style.width = "100%";
      image.style.height = storedHeight && storedHeight !== "auto" ? storedHeight : "auto";
    } else if (storedWidth !== "auto") {
      container.style.width = isCentered ? storedWidth : "auto";
      container.style.minWidth = isCentered ? "100%" : "";
      if (figure) figure.style.width = storedWidth;
      image.style.width = storedWidth;
      image.style.height = storedHeight && storedHeight !== "auto" ? storedHeight : "auto";
    }
  });
};

export interface SunEditorHandle {
  getContents: () => string;
  waitForPendingUploads: () => Promise<void>;
}

type MiniSelectionState = {
  visible: boolean;
  top: number;
  left: number;
  text: string;
  tag: string;
  fontFamily: string;
  fontSize: string;
};

type SunEditorInstance = ReturnType<typeof suneditor.create>;

const SunEditor = forwardRef<SunEditorHandle, SunEditorProps>(
  function SunEditor({ blogData, setBlogData, variant = "full" }, ref) {
    const isCompact = variant === "compact";
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [canInitialize, setCanInitialize] = useState(false);
  const editorInstanceRef = useRef<SunEditorInstance | null>(null);
  const wysiwygRef = useRef<HTMLElement | null>(null);
  const selectedTableRef = useRef<HTMLTableElement | null>(null);
  const setBlogDataRef = useRef<(value: string) => void>(() => {});
  const [miniSelection, setMiniSelection] = useState<MiniSelectionState>({
    visible: false,
    top: 0,
    left: 0,
    text: "",
    tag: "",
    fontFamily: "",
    fontSize: "",
  });
  const initialHtml = restoreImageSizeMetadata(blogData);
  const initialDataRef = useRef(initialHtml);
  const lastContentRef = useRef<string>(initialHtml);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingImageUploadsRef = useRef<Set<Promise<void>>>(new Set());

  const applyInlineStyle = (style: Partial<CSSStyleDeclaration>) => {
    const wysiwygElement = wysiwygRef.current;
    if (!wysiwygElement) return;

    const selection = wysiwygElement.ownerDocument.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const span = wysiwygElement.ownerDocument.createElement("span");
    Object.entries(style).forEach(([key, value]) => {
      if (typeof value === "string" && value) {
        const cssProperty = key.replace(
          /[A-Z]/g,
          (character) => `-${character.toLowerCase()}`,
        );
        span.style.setProperty(cssProperty, value);
      }
    });

    try {
      span.appendChild(range.extractContents());
      range.insertNode(span);
      selection.removeAllRanges();
      selection.addRange(range);
      const html =
        editorInstanceRef.current?.$.html?.get?.() ?? wysiwygElement.innerHTML;
      lastContentRef.current = html;
      setBlogDataRef.current(html);
    } catch (error) {
      console.warn("Failed to apply inline style:", error);
    }
  };

  useImperativeHandle(ref, () => ({
    getContents: () => {
      const editor = editorInstanceRef.current;
      if (editor?.$?.html && typeof editor.$.html.get === "function") {
        return editor.$.html.get();
      }
      return lastContentRef.current ?? "";
    },
    waitForPendingUploads: async () => {
      while (pendingImageUploadsRef.current.size > 0) {
        await Promise.allSettled(Array.from(pendingImageUploadsRef.current));
      }
    },
  }), []);

  useEffect(() => {
    setBlogDataRef.current = setBlogData;
  }, [setBlogData]);

  // React Strict Mode runs the initial effect setup/cleanup cycle twice in
  // development. Initialize the third-party editor on the next task so the
  // disposable test cycle never creates a native SunEditor instance.
  useEffect(() => {
    const timer = window.setTimeout(() => setCanInitialize(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const miniSummary = useMemo(() => {
    const text = miniSelection.text.trim();
    if (!text) return "Chưa chọn nội dung";
    const clipped = text.length > 40 ? `${text.slice(0, 40)}...` : text;
    const meta = [miniSelection.tag, miniSelection.fontFamily, miniSelection.fontSize]
      .filter(Boolean)
      .join(" · ");
    return meta ? `${clipped} | ${meta}` : clipped;
  }, [miniSelection]);

  // Keep editor content synchronized with the blogData prop from parent safely
  useEffect(() => {
    const editor = editorInstanceRef.current;
    if (editor && editor.$?.html && typeof editor.$.html.set === "function") {
      if (blogData !== lastContentRef.current) {
        try {
          const normalizedHtml = restoreImageSizeMetadata(blogData);
          lastContentRef.current = normalizedHtml;
          editor.$.html.set(normalizedHtml ?? "");
        } catch (error) {
          console.warn("SunEditor synchronization safely interrupted:", error);
        }
      }
    }
  }, [blogData]);

  // Initialize SunEditor once on mount
  useEffect(() => {
    if (!canInitialize) return;

    const textareaElement = textareaRef.current;
    if (!textareaElement) {
      return;
    }
    let disposed = false;

    const onImageUploadBeforeHandler = (params: {
      $: any;
      info: any;
      handler: any;
    }) => {
      const { info, $ } = params || {};

      // URL images are inserted by SunEditor's native URL flow. Returning
      // true tells SunEditor to invoke its URL handler, preserving the
      // URL, alternative text, sizing, alignment, and update state without
      // invoking our file-upload API.
      if (typeof info?.url === "string" && info.url.trim()) {
        const resolvedUrl = resolveEditorImageUrl(info.url);
        if (resolvedUrl !== info.url) {
          return { ...info, url: resolvedUrl };
        }
        return true;
      }

      const files = info?.files;
      if (files && files.length > 0) {
        imageService
          .uploadEditorImage(files[0], true)
          .then((result) => {
            if (result && !disposed && editorInstanceRef.current) {
              const imageUrl = resolveEditorImageUrl(
                result.url || result.imageUrl,
              );

              if (info.isUpdate && info.element) {
                // Update existing image src
                info.element.src = imageUrl;
                if ($ && $.plugins?.image?.fileManager?.setFileData) {
                  $.plugins.image.fileManager.setFileData(info.element, {
                    name: result.filename || files[0].name,
                    size: result.size || files[0].size,
                  });
                }
              } else {
                // Insert new image using SunEditor's native image creator
                if (
                  $ &&
                  $.plugins?.image &&
                  typeof $.plugins.image.create === "function"
                ) {
                  $.plugins.image.create(
                    imageUrl,
                    info.anchor || null,
                    info.inputWidth || "auto",
                    info.inputHeight || "auto",
                    info.align || "none",
                    {
                      name: result.filename || files[0].name,
                      size: result.size || files[0].size,
                    },
                    info.alt || files[0].name || "",
                    true,
                  );
                } else {
                  // Fallback if plugin is not available
                  const imgHtml = `<img src="${imageUrl}" alt="${files[0].name || ""}" style="max-width: 100%;" />`;
                  if ($ && $.html && typeof $.html.insert === "function") {
                    $.html.insert(imgHtml);
                  } else if (
                    editorInstanceRef.current &&
                    editorInstanceRef.current.$?.html?.insert
                  ) {
                    editorInstanceRef.current.$?.html?.insert(imgHtml);
                  }
                }
              }

              // Close image modal if open
              if (
                $ &&
                $.plugins?.image?.modal &&
                typeof $.plugins.image.modal.close === "function"
              ) {
                $.plugins.image.modal.close();
              }
            }
          })
          .catch((err) => {
            if (disposed) return;
            console.error("SunEditor image upload error:", err);
            alert("Không thể upload ảnh minh họa. Vui lòng thử lại.");
          });
      }

      // Ngăn chặn SunEditor kích hoạt API mặc định của nó
      return false;
    };

    const instance = suneditor.create(textareaElement, {
      plugins: editorPlugins,
      value: initialDataRef.current ?? "",
      lang: {
        ...en,
        image_modal_file: "Upload image from device",
        image_modal_url: "Image source URL (local path or website)",
        link_modal_url: "Destination URL opened when clicked",
      },
      defaultUrlProtocol: "https://",
      // onImageUploadBefore: onImageUploadBeforeHandler as any,
      events: {
        onChange: ({ data }: { $: any; frameContext: any; data: string }) => {
          lastContentRef.current = data;
          if (isCompact) {
            if (!disposed && setBlogDataRef.current) {
              setBlogDataRef.current(data);
            }
            return;
          }
          if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
          }
          debounceTimeoutRef.current = setTimeout(() => {
            if (!disposed && setBlogDataRef.current) {
              setBlogDataRef.current(data);
            }
          }, 300);
        },
        onImageUploadBefore: onImageUploadBeforeHandler as any,
      },
      toolbar_sticky: 0,
      mode: isCompact ? "balloon" : "classic",
      minHeight: isCompact ? "96px" : "500px",
      ...(isCompact
        ? {}
        : {
            subToolbar: {
              mode: "balloon" as const,
              width: "auto",
              buttonList: [
                ["font", "fontSize", "blockStyle"],
                "|",
                ["bold", "italic", "underline", "strike"],
                "|",
                ["fontColor", "backgroundColor"],
                "|",
                ["align", "list"],
                "|",
                ["link", "image", "video"],
                "|",
                ["removeFormat"],
              ],
            },
          }),
      paragraphStyle: {
        items: ["spaced", "bordered", "neon"],
      },
      // SunEditor supports this runtime option, but its bundled type omits it.
      // @ts-expect-error Missing from SunEditor's EditorInitOptions declaration.
      pasteKeepStyle: true,
      pasteTagsWhitelist: 'p|div|h1|h2|h3|h4|h5|h6|span|b|strong|i|em|u|strike|s|ol|ul|li|hr|table|tbody|thead|tfoot|tr|td|th|img|br|a|video|audio|iframe',
      attributeWhitelist: {
        "p|span|div|h1|h2|h3|h4|h5|h6|b|strong|i|em|ul|ol|li|table|tbody|thead|tfoot|tr|td|th|a|figure|figcaption|video|audio|iframe": "style|class|dir",
        img: "style|class|dir|data-se-size",
      },
      tagStyles: {
        "p|span|div|h1|h2|h3|h4|h5|h6|b|strong|i|em|ul|ol|li|table|tbody|thead|tfoot|tr|td|th|a|figcaption|video|audio|iframe|img": "color|background-color|font-family|font-size|font-weight|font-style|text-decoration|text-align|line-height|margin|padding|width|height|border|float|display",
        figure: "color|background-color|font-family|font-size|font-weight|font-style|text-decoration|text-align|line-height|margin|padding|width|height|border|float|display|padding-bottom|margin-left|margin-right|max-width",
      },
      font: {
        items: [
          "Arial",
          "Arial Black",
          "Calibri",
          "Cambria",
          "Comic Sans MS",
          "Courier New",
          "Georgia",
          "Impact",
          "Segoe UI",
          "Tahoma",
          "Times New Roman",
          "Trebuchet MS",
          "Verdana",
        ],
      },
      image: {
        // File uploads use our authenticated handler; keep native resizing
        // enabled for both uploaded and URL-based images.
        canResize: true,
      },
      backgroundColor: {
        disableHEXInput: true,
      },
      // Đã loại bỏ các nút plugin nâng cao thiếu cấu hình gây log lỗi (exportPDF, layout, template, math...)
      buttonList: isCompact
        ? [
            ["font", "fontSize", "blockStyle"],
            "|",
            ["bold", "italic", "underline", "strike"],
            "|",
            ["fontColor", "backgroundColor"],
            "|",
            ["align", "list"],
            "|",
            ["link", "image", "video", "removeFormat"],
          ]
        : [
            ["undo", "redo"],
            "|",
            ["font", "fontSize", "blockStyle"],
            "|",
            ["bold", "italic", "underline", "strike"],
            "|",
            ["fontColor", "backgroundColor"],
            "|",
            ["outdent", "indent", "align", "list"],
            "|",
            ["table", "link", "image", "video"],
            "|",
            ["fullScreen", "preview", "print", "removeFormat"],
            ["subscript", "superscript", "blockquote", "hr", "showBlocks"],
          ],
    });

    editorInstanceRef.current = instance;

    const wysiwygElement = (
      (instance as any).$?.frameContext?.get?.("wysiwyg") ??
      (instance as any).core?.context?.element?.wysiwyg
    ) as HTMLElement | undefined;
    wysiwygRef.current = wysiwygElement ?? null;
    const editorRoot = (
      textareaElement.closest(".sun-editor") ??
      (instance as any).core?.context?.element?.topArea
    ) as HTMLElement | null;
    const toolbarElement = (
      (instance as any).core?.context?.element?.toolbar ?? editorRoot
    ) as HTMLElement | null;
    const processingPastedImages = new WeakSet<HTMLImageElement>();
    let pastedImageTimer = 0;

    const uploadPastedBase64Images = async () => {
      if (disposed || !wysiwygElement || !editorInstanceRef.current) return;

      const pastedImages = Array.from(
        wysiwygElement.querySelectorAll<HTMLImageElement>(
          'img[src^="data:image/"]',
        ),
      ).filter((imageElement) => !processingPastedImages.has(imageElement));

      if (pastedImages.length === 0) return;
      pastedImages.forEach((imageElement) => processingPastedImages.add(imageElement));

      const results = await Promise.allSettled(
        pastedImages.map(async (imageElement, index) => {
          const source = imageElement.getAttribute("src") || "";
          const file = base64ImageToFile(source, index);
          const result = await imageService.uploadEditorImage(file, true);
          if (disposed || !imageElement.isConnected) return;

          const uploadedUrl = resolveEditorImageUrl(result.url || result.imageUrl);
          if (!uploadedUrl) throw new Error("Image upload did not return a URL");

          imageElement.src = uploadedUrl;
          imageElement.setAttribute("data-se-size", imageElement.getAttribute("data-se-size") || "auto,auto");
        }),
      );

      if (disposed || !editorInstanceRef.current) return;

      const failedIndexes = results.flatMap((result, index) =>
        result.status === "rejected" ? [index] : [],
      );
      const failedCount = failedIndexes.length;
      if (failedCount > 0) {
        console.error("Failed to upload pasted editor images:", results);
        failedIndexes.forEach((index) => pastedImages[index]?.remove());
        alert(`Không thể upload ${failedCount} ảnh được dán. Vui lòng thử dán lại ảnh.`);
      }

      const html = editorInstanceRef.current.$?.html?.get?.() ?? wysiwygElement.innerHTML;
      lastContentRef.current = html;
      setBlogDataRef.current(html);
      (editorInstanceRef.current as any).$?.history?.push?.();
    };

    const trackPastedImageUpload = () => {
      const uploadPromise = uploadPastedBase64Images();
      pendingImageUploadsRef.current.add(uploadPromise);
      void uploadPromise.finally(() => {
        pendingImageUploadsRef.current.delete(uploadPromise);
      });
    };

    const handlePastedImages = () => {
      window.clearTimeout(pastedImageTimer);
      // Let SunEditor finish sanitizing and inserting the clipboard HTML first.
      pastedImageTimer = window.setTimeout(() => {
        trackPastedImageUpload();
      }, 0);
    };

    const pastedImageObserver = wysiwygElement
      ? new MutationObserver((mutations) => {
          const hasBase64Image = mutations.some((mutation) => {
            if (
              mutation.type === "attributes" &&
              mutation.target instanceof HTMLImageElement
            ) {
              return /^data:image\//i.test(
                mutation.target.getAttribute("src") || "",
              );
            }

            return Array.from(mutation.addedNodes).some((node) => {
              if (!(node instanceof HTMLElement)) return false;
              if (
                node instanceof HTMLImageElement &&
                /^data:image\//i.test(node.getAttribute("src") || "")
              ) {
                return true;
              }
              return Boolean(node.querySelector('img[src^="data:image/"]'));
            });
          });

          if (hasBase64Image) trackPastedImageUpload();
        })
      : null;

    pastedImageObserver?.observe(wysiwygElement!, {
      attributes: true,
      attributeFilter: ["src"],
      childList: true,
      subtree: true,
    });

    const setDisplayedFontSize = (computedSize: string) => {
      if (!editorInstanceRef.current) return;
      const numericSize = Number.parseFloat(computedSize);
      const displaySize = Number.isFinite(numericSize)
        ? `${Math.round(numericSize)}px`
        : computedSize;
      const commandTargets = (
        instance as any
      ).$?.commandDispatcher?.targets?.get?.("fontSize") as
        | HTMLElement[]
        | undefined;
      const controls = new Set<HTMLElement>();

      commandTargets?.forEach((target) => {
        const control = target.parentElement?.querySelector<HTMLElement>(
          ".__se__font_size",
        );
        if (control) controls.add(control);
      });

      if (controls.size === 0) {
        const fallback = toolbarElement?.querySelector<HTMLElement>(
          ".se-btn-tool-font-size .__se__font_size",
        );
        if (fallback) controls.add(fallback);
      }

      controls.forEach((control) => {
        if (control instanceof HTMLInputElement) {
          if (control !== control.ownerDocument.activeElement) {
            control.value = displaySize;
          }
        } else {
          control.textContent = displaySize;
        }
      });
    };
    const blockFontSizes: Record<string, string> = {
      p: "16px",
      h1: "32px",
      h2: "24px",
      h3: "20px",
      h4: "18px",
      h5: "16px",
      h6: "14px",
    };

    // Compatibility layer retained for existing content after the 3.2 upgrade:
    // fontSize.active() may not expose a value for line elements.
    // `undefined` for line elements, which freezes the toolbar at 16px for
    // every heading. SelectionState resolves this method dynamically, so the
    // override participates in SunEditor's normal toolbar refresh lifecycle.
    const fontSizePlugin = (instance as any).$?.plugins?.fontSize;
    const originalFontSizeActive = fontSizePlugin?.active?.bind(fontSizePlugin);
    if (fontSizePlugin && originalFontSizeActive) {
      fontSizePlugin.active = (element: HTMLElement | null, target: HTMLElement) => {
        if (element && /^(P|H[1-6])$/.test(element.nodeName)) {
          const computedSize = element.ownerDocument.defaultView
            ?.getComputedStyle(element)
            .fontSize;
          if (computedSize) {
            setDisplayedFontSize(computedSize);
            return true;
          }
        }

        return originalFontSizeActive(element, target);
      };
    }

    // Give every block format an explicit px size. This makes the saved HTML,
    // editor toolbar and public preview independent from browser heading
    // defaults expressed in em.
    const blockStylePlugin = (instance as any).$?.plugins?.blockStyle;
    const originalBlockStyleAction = blockStylePlugin?.action?.bind(blockStylePlugin);
    if (blockStylePlugin && originalBlockStyleAction) {
      blockStylePlugin.action = (target: HTMLElement) => {
        const nextTag = target.getAttribute("data-value")?.toLowerCase() ?? "";
        originalBlockStyleAction(target);

        const explicitSize = blockFontSizes[nextTag];
        const selection = wysiwygElement?.ownerDocument.getSelection();
        const anchorNode = selection?.anchorNode;
        const selectedElement = anchorNode
          ? ((anchorNode.nodeType === Node.ELEMENT_NODE
              ? anchorNode
              : anchorNode.parentElement) as HTMLElement | null)
          : null;
        const lineElement = selectedElement?.closest<HTMLElement>(
          "p, h1, h2, h3, h4, h5, h6",
        );

        if (explicitSize && lineElement && wysiwygElement?.contains(lineElement)) {
          lineElement.style.fontSize = explicitSize;
          setDisplayedFontSize(explicitSize);
        }
      };
    }

    const formatControl = toolbarElement?.querySelector<HTMLElement>(
      ".se-btn-tool-format .se-txt",
    ) ?? null;
    const syncSizeFromFormatControl = () => {
      if (!editorInstanceRef.current) return;
      if (!formatControl || !wysiwygElement) return;

      const formatLabel = formatControl.textContent?.trim() ?? "";
      const tag = (
        formatControl.dataset.value ||
        (/header\s*([1-6])/i.exec(formatLabel)?.[1]
          ? `h${/header\s*([1-6])/i.exec(formatLabel)?.[1]}`
          : /^paragraph$/i.test(formatLabel)
            ? "p"
            : "")
      ).toLowerCase();
      const explicitSize = blockFontSizes[tag];
      if (explicitSize) setDisplayedFontSize(explicitSize);
    };
    let formatObserver: MutationObserver | null = null;
    if (formatControl) {
      formatObserver = new MutationObserver(syncSizeFromFormatControl);
      formatObserver.observe(formatControl, {
        attributes: true,
        attributeFilter: ["data-value"],
        characterData: true,
        childList: true,
        subtree: true,
      });
    }

    let hasToolbarInteraction = false;
    const initializeToolbarDefaults = () => {
      if (!editorInstanceRef.current) return;
      if (hasToolbarInteraction) return;
      if (!toolbarElement || !wysiwygElement) return;

      const defaultSize = wysiwygElement.ownerDocument.defaultView
        ?.getComputedStyle(wysiwygElement)
        .fontSize;
      if (defaultSize) setDisplayedFontSize(defaultSize);

      const fontControl = toolbarElement.querySelector<HTMLElement>(
        ".se-btn-tool-font input, .se-btn-tool-font .se-txt",
      );
      if (fontControl instanceof HTMLInputElement) {
        fontControl.value = '"Helvetica Neue"';
      } else if (fontControl) {
        fontControl.textContent = '"Helvetica Neue"';
      }

      if (formatControl) {
        formatControl.dataset.value = "p";
        formatControl.textContent = "Paragraph";
        syncSizeFromFormatControl();
      }
    };
    const toolbarInitFrame = requestAnimationFrame(initializeToolbarDefaults);
    const toolbarInitTimer = window.setTimeout(initializeToolbarDefaults, 100);

    // Keep the font-size control synchronized when the current
    // selection is a line element (h1, h2, h3...). Reflect the computed size
    // so the toolbar always shows the size users actually see in the editor.
    const syncDisplayedFontSize = () => {
      if (!editorInstanceRef.current) return;
      if (!wysiwygElement || !toolbarElement) return;

      const selection = wysiwygElement.ownerDocument.getSelection();
      const anchorNode = selection?.anchorNode;
      if (!anchorNode) return;

      const selectedElement = (
        anchorNode.nodeType === Node.ELEMENT_NODE
          ? anchorNode
          : anchorNode.parentElement
      ) as HTMLElement | null;
      if (!selectedElement || !wysiwygElement.contains(selectedElement)) return;

      const computedSize = selectedElement.ownerDocument.defaultView
        ?.getComputedStyle(selectedElement)
        .fontSize;
      if (!computedSize) return;

      setDisplayedFontSize(computedSize);
    };

    const updateMiniSelection = () => {
      if (!editorInstanceRef.current) return;
      if (!wysiwygElement) return;
      if (isCompact) {
        setMiniSelection((prev) => ({ ...prev, visible: false }));
        return;
      }

      const selection = wysiwygElement.ownerDocument.getSelection();
      const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      const text = selection?.toString() ?? "";

      if (
        !range ||
        !wysiwygElement.contains(range.commonAncestorContainer) ||
        !text.trim()
      ) {
        setMiniSelection((prev) => ({ ...prev, visible: false }));
        return;
      }

      const rect = range.getBoundingClientRect();
      if (!rect || (rect.width === 0 && rect.height === 0)) {
        setMiniSelection((prev) => ({ ...prev, visible: false }));
        return;
      }

      const selectedElement = (
        range.startContainer.nodeType === Node.ELEMENT_NODE
          ? range.startContainer
          : range.startContainer.parentElement
      ) as HTMLElement | null;
      const computed = selectedElement?.ownerDocument.defaultView?.getComputedStyle(selectedElement);

      setMiniSelection({
        visible: true,
        top: Math.max(12, window.scrollY + rect.top - 64),
        left: Math.max(12, window.scrollX + rect.left),
        text,
        tag: selectedElement?.tagName.toLowerCase() ?? "",
        fontFamily: computed?.fontFamily?.replace(/["']/g, "") ?? "",
        fontSize: computed?.fontSize ?? "",
      });
    };

    // The built-in fontSize plugin ignores line elements, so explicitly
    // refresh the control after Paragraph/Heading has been changed.
    const syncFontSizeAfterBlockChange = (event: Event) => {
      if (!editorInstanceRef.current) return;
      const target = event.target as HTMLElement | null;
      const formatOption = target?.closest<HTMLButtonElement>(
        ".se-list-format button[data-value]",
      );
      if (!formatOption || !wysiwygElement) return;

      const nextTag = formatOption.dataset.value?.toLowerCase();
      if (!nextTag || !/^(p|h[1-6])$/.test(nextTag)) return;
      hasToolbarInteraction = true;
      const applySelectedBlockSize = () => {
        const explicitSize = blockFontSizes[nextTag];
        if (explicitSize) setDisplayedFontSize(explicitSize);
      };

      window.setTimeout(applySelectedBlockSize, 0);
      window.setTimeout(applySelectedBlockSize, 50);
    };

    const tablePlugin = (instance as any).$?.plugins?.table as
      | {
          _element?: HTMLTableElement;
          _closeTableSelectInfo?: () => void;
          _editorEnable?: (enabled: boolean) => void;
          historyPush?: () => void;
          styleService?: {
            propTargets?: { cell_alignment?: HTMLElement };
            submitProps?: (target: HTMLButtonElement) => void;
          };
        }
      | undefined;
    const tableStyleService = tablePlugin?.styleService;
    const originalTableSubmit = tableStyleService?.submitProps?.bind(tableStyleService);

    if (tableStyleService && originalTableSubmit) {
      tableStyleService.submitProps = (target: HTMLButtonElement) => {
        const alignment =
          tableStyleService.propTargets?.cell_alignment
            ?.getAttribute("se-cell-align")
            ?.toLowerCase() ?? "";
        const tableElement = tablePlugin?._element ?? selectedTableRef.current;
        const figureElement = tableElement?.closest<HTMLElement>("figure");
        const tableWidth = tableElement?.getBoundingClientRect().width ?? 0;

        originalTableSubmit(target);

        if (!figureElement || !["left", "center", "right"].includes(alignment)) {
          return;
        }

        if (alignment === "center") {
          figureElement.style.cssFloat = "none";
          if (tableWidth > 0) {
            figureElement.style.width = `${tableWidth}px`;
          }
          figureElement.style.maxWidth = "100%";
          figureElement.style.marginLeft = "auto";
          figureElement.style.marginRight = "auto";
        } else {
          figureElement.style.marginLeft = "";
          figureElement.style.marginRight = "";
        }

        tablePlugin?.historyPush?.();
        const html =
          editorInstanceRef.current?.$.html?.get?.() ??
          wysiwygElement?.innerHTML ??
          "";
        lastContentRef.current = html;
        setBlogDataRef.current(html);
      };
    }

    let selectionFrame = 0;
    let closeTableTimer = 0;
    const restoreSelectedImageSize = (event: Event) => {
      if (!editorInstanceRef.current) return;
      const target = event.target as HTMLElement | null;
      if (!target?.closest(".se-image-container")) return;
      cancelAnimationFrame(selectionFrame);
      selectionFrame = requestAnimationFrame(() => {
        if (wysiwygElement?.isConnected) applyStoredImageSizes(wysiwygElement);
      });
    };
    const closeTableSelectionOutside = (event: Event) => {
      if (!editorInstanceRef.current) return;
      const target = event.target as HTMLElement | null;
      const selectedTable = target?.closest<HTMLTableElement>("table") ?? null;

      if (selectedTable && wysiwygElement?.contains(selectedTable)) {
        selectedTableRef.current = selectedTable;
        return;
      }

      // Keep the native table controllers usable. Their controls live outside
      // the editable area even though they operate on the selected table.
      if (
        target?.closest(
          ".se-controller, .se-dialog, .se-list-layer, .se-menu-list",
        )
      ) {
        return;
      }

      window.clearTimeout(closeTableTimer);
      closeTableTimer = window.setTimeout(() => {
        if (!selectedTableRef.current && !tablePlugin?._element) return;

        // Run after SunEditor's document handlers so a cached range cannot
        // immediately select the table again.
        tablePlugin?._editorEnable?.(true);
        tablePlugin?._closeTableSelectInfo?.();
        selectedTableRef.current = null;
      }, 0);
    };
    const recoverNativeTableEditing = (event: Event) => {
      if (!editorInstanceRef.current) return;
      const target = event.target as HTMLElement | null;
      if (!target?.closest("td, th") || !wysiwygElement) return;

      // The native table plugin temporarily disables contenteditable while
      // selecting cells. Normally its global mouseup handler restores it.
      // Reuse the plugin's own recovery method only when that state is stuck.
      window.setTimeout(() => {
        if (wysiwygElement.getAttribute("contenteditable") === "true") return;

        const tablePlugin = (instance as any).$?.plugins?.table as
          | { _editorEnable?: (enabled: boolean) => void }
          | undefined;
        tablePlugin?._editorEnable?.(true);
      }, 0);
    };

    if (wysiwygElement) {
      applyStoredImageSizes(wysiwygElement);
      wysiwygElement.addEventListener("pointerdown", restoreSelectedImageSize);
      wysiwygElement.addEventListener("keyup", syncDisplayedFontSize);
      wysiwygElement.addEventListener("mouseup", syncDisplayedFontSize);
      wysiwygElement.addEventListener("mouseup", recoverNativeTableEditing);
      wysiwygElement.addEventListener("focus", syncDisplayedFontSize);
      wysiwygElement.addEventListener("paste", handlePastedImages);
      wysiwygElement.ownerDocument.addEventListener(
        "pointerdown",
        closeTableSelectionOutside,
      );
      if (!isCompact) {
        wysiwygElement.ownerDocument.addEventListener(
          "selectionchange",
          updateMiniSelection,
        );
      }
      wysiwygElement.ownerDocument.addEventListener(
        "selectionchange",
        syncDisplayedFontSize,
      );
      toolbarElement?.ownerDocument.addEventListener(
        "click",
        syncFontSizeAfterBlockChange,
        true,
      );
    }

    return () => {
      disposed = true;
      // Clear the public ref before destruction so React effects cannot call an
      // editor whose internal store/frame context is already being released.
      editorInstanceRef.current = null;
      wysiwygRef.current = null;
      setBlogDataRef.current = () => {};
      selectedTableRef.current = null;
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      cancelAnimationFrame(selectionFrame);
      cancelAnimationFrame(toolbarInitFrame);
      window.clearTimeout(toolbarInitTimer);
      formatObserver?.disconnect();
      pastedImageObserver?.disconnect();
      wysiwygElement?.removeEventListener("pointerdown", restoreSelectedImageSize);
      wysiwygElement?.removeEventListener("keyup", syncDisplayedFontSize);
      wysiwygElement?.removeEventListener("mouseup", syncDisplayedFontSize);
      wysiwygElement?.removeEventListener("mouseup", recoverNativeTableEditing);
      wysiwygElement?.removeEventListener("focus", syncDisplayedFontSize);
      wysiwygElement?.removeEventListener("paste", handlePastedImages);
      wysiwygElement?.ownerDocument.removeEventListener(
        "pointerdown",
        closeTableSelectionOutside,
      );
      if (!isCompact) {
        wysiwygElement?.ownerDocument.removeEventListener(
          "selectionchange",
          updateMiniSelection,
        );
      }
      wysiwygElement?.ownerDocument.removeEventListener(
        "selectionchange",
        syncDisplayedFontSize,
      );
      toolbarElement?.ownerDocument.removeEventListener(
        "click",
        syncFontSizeAfterBlockChange,
        true,
      );
      window.clearTimeout(closeTableTimer);
      window.clearTimeout(pastedImageTimer);
      if (tableStyleService && originalTableSubmit) {
        tableStyleService.submitProps = originalTableSubmit;
      }
      if (fontSizePlugin && originalFontSizeActive) {
        fontSizePlugin.active = originalFontSizeActive;
      }
      if (blockStylePlugin && originalBlockStyleAction) {
        blockStylePlugin.action = originalBlockStyleAction;
      }
      if (isCompact) {
        const topArea = (instance as any)?.core?.context?.element?.topArea as
          | HTMLElement
          | undefined;
        topArea?.remove();

        // SunEditor 3.2.3 can still have balloon focus callbacks queued here.
        // Let them drain before destroy() clears store/frameContext.
        window.setTimeout(() => {
          try {
            instance.destroy();
          } catch (error) {
            console.warn("Error while destroying compact SunEditor:", error);
          }
        }, 1000);
        return;
      }
      if (instance) {
        const destroyInstance = () => {
          try {
            instance.destroy();
          } catch (error) {
            console.warn("Error while destroying SunEditor:", error);
          }
        };

        // The full editor schedules controller/selection work beyond the
        // current macrotask. Let those callbacks drain before cleanup.
        window.setTimeout(destroyInstance, 1000);
      }
    };
  }, [canInitialize, isCompact]);

  return (
    <div className="relative">
      {!isCompact && miniSelection.visible && (
        <div
          className="fixed z-[9999] w-[380px] max-w-[calc(100vw-24px)] rounded-xl border border-white/15 bg-[#1f1f1f] p-3 text-white shadow-2xl"
          style={{ top: miniSelection.top, left: miniSelection.left }}
        >
          <div className="mb-2 text-xs text-white/60">{miniSummary}</div>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1 text-[11px] text-white/60">
              Font
              <select
                value={miniSelection.fontFamily}
                onChange={(e) => applyInlineStyle({ fontFamily: e.target.value })}
                className="rounded-md border border-white/10 bg-black/40 px-2 py-1 text-sm text-white outline-none"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica Neue">Helvetica Neue</option>
                <option value="Calibri">Calibri</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Tahoma">Tahoma</option>
                <option value="Verdana">Verdana</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-[11px] text-white/60">
              Size
              <select
                value={miniSelection.fontSize}
                onChange={(e) => applyInlineStyle({ fontSize: e.target.value })}
                className="rounded-md border border-white/10 bg-black/40 px-2 py-1 text-sm text-white outline-none"
              >
                <option value="12px">12</option>
                <option value="14px">14</option>
                <option value="16px">16</option>
                <option value="18px">18</option>
                <option value="20px">20</option>
                <option value="24px">24</option>
                <option value="32px">32</option>
              </select>
            </label>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-sm font-bold hover:bg-white/10" onClick={() => editorInstanceRef.current?.$?.commandDispatcher?.run?.("bold", "command")}>B</button>
            <button type="button" className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-sm italic hover:bg-white/10" onClick={() => editorInstanceRef.current?.$?.commandDispatcher?.run?.("italic", "command")}>I</button>
            <button type="button" className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-sm underline hover:bg-white/10" onClick={() => editorInstanceRef.current?.$?.commandDispatcher?.run?.("underline", "command")}>U</button>
            <button type="button" className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-sm line-through hover:bg-white/10" onClick={() => editorInstanceRef.current?.$?.commandDispatcher?.run?.("strike", "command")}>S</button>
            <button type="button" className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-sm hover:bg-white/10" onClick={() => setMiniSelection((prev) => ({ ...prev, visible: false }))}>Close</button>
          </div>
        </div>
      )}
      <textarea
        className={`w-full border border-gray-300 rounded-lg p-2 ${
          isCompact ? "min-h-24" : "min-h-[500px]"
        }`}
        ref={textareaRef}
        defaultValue={blogData}
      />
    </div>
  );
  },
);

SunEditor.displayName = "SunEditor";

export default SunEditor;
