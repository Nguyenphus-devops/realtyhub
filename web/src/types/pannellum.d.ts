/**
 * Pannellum khong phat hanh kem type, va cung khong co goi @types/pannellum.
 *
 * File build la script kieu UMD: nap vao la no gan `window.pannellum`. Ta chi
 * can TypeScript cho phep `import` de kich hoat script do; phan API dang dung
 * da duoc khai bao thu cong ngay trong Photo360Tab.tsx.
 */
declare module 'pannellum/build/pannellum.js';
