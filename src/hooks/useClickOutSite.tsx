import { CaretDownOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";

export default function ClickOutSite() {
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const optionRef = useRef(null);

  const handleClickOutSide = (e: any) => {
    const target = e.target as HTMLElement;
    console.log(e.target);

    if (showOptions && !target.closest(".option")) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutSide);

    return () => {
      window.removeEventListener("click", handleClickOutSide);
    };
  }, [showOptions]);

  return (
    <div className="w-full h-screen flex items-center justify-center relative">
      <div className="size-[50px] border border-red-500 border-solid border-l-blue-300 border-r-gray-800 rounded-full animate-spin"></div>

      <div className="relative">
        <div className="border border-solid border-[#dadada] h-9 leading-9 px-4 rounded shadow-md flex items-center gap-2">
          <span>Nguyễn Văn Nam</span>
          <CaretDownOutlined
            onClick={() => setShowOptions(!showOptions)}
            className="cursor-pointer hover:text-[#333] option"
          />
        </div>
        {showOptions && (
          <ul
            ref={optionRef}
            className="border border-solid border-[#dadada] mt-1 rounded shadow-md absolute w-full"
          >
            <li className="px-4 py-2 hover:bg-[#dadada] cursor-pointer">
              Cài đặt
            </li>
            <li className="px-4 py-2 hover:bg-[#dadada] cursor-pointer">
              Đổi mật khẩu
            </li>
            <li className="px-4 py-2 hover:bg-[#dadada] cursor-pointer">
              Đăng xuất
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
