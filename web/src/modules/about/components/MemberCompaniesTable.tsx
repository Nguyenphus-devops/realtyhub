import { FiMapPin } from 'react-icons/fi';

import { MEMBER_COMPANIES } from '../mocks/about.mock';

/**
 * Bang dia chi cac cong ty thanh vien - dung chung o /gioi-thieu va
 * /lien-he-chung-toi. Cuon ngang trong khung rieng: dia chi dai, ep xuong
 * man hinh 375px se vo thanh cot chu vai ky tu.
 */
const MemberCompaniesTable = () => (
  <>
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
      <table className="w-full min-w-160 border-collapse text-left">
        <thead className="bg-gray-50">
          <tr className="text-theme-xs font-bold uppercase tracking-[0.15em] text-gray-500">
            <th scope="col" className="w-14 px-4 py-4 text-center">
              STT
            </th>
            <th scope="col" className="px-4 py-4">
              Công ty
            </th>
            <th scope="col" className="px-4 py-4">
              Địa chỉ
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {MEMBER_COMPANIES.map((company, index) => (
            <tr key={company.name} className="align-top transition hover:bg-brand-25">
              <td className="px-4 py-4 text-center text-theme-sm font-semibold text-gray-400">
                {index + 1}
              </td>
              <td className="px-4 py-4">
                <span className="block text-theme-sm font-bold text-navy-800">
                  {company.name}
                </span>
                {company.note && (
                  <span className="mt-1 inline-flex rounded-full bg-brand-50 px-2.5 py-0.5 text-theme-xs font-bold uppercase tracking-[0.15em] text-brand-700">
                    {company.note}
                  </span>
                )}
              </td>
              <td className="px-4 py-4 text-theme-sm leading-relaxed text-gray-600">
                {company.address || (
                  <span className="italic text-gray-400">Đang cập nhật</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <p className="mt-4 flex items-start gap-2 text-theme-xs leading-relaxed text-gray-500">
      <FiMapPin aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
      Địa chỉ ghi &quot;Đang cập nhật&quot; là các đơn vị chưa công bố trụ sở trên nguồn công
      khai — vui lòng liên hệ hotline để được hỗ trợ.
    </p>
  </>
);

export default MemberCompaniesTable;
