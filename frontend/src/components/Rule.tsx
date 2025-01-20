import { useEffect, useRef } from "react";

const Rules = ({ rule }: { rule: string }) => {
  const rulesRef = useRef(null);
  const textRef: any = useRef(null);

  useEffect(() => {
    const isOverflowing = (element: any) => {
      return (
        element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth
      );
    };
    const checkOverflow = () => {
      if (textRef.current && rule.length > 0) {
        let currentFontSize = parseFloat(
          window
            .getComputedStyle(textRef.current, null)
            .getPropertyValue("font-size")
        );
        while (!isOverflowing(rulesRef.current) && currentFontSize > 0) {
          currentFontSize++;
          textRef.current.style.fontSize = `${currentFontSize}px`;
        }
        while (isOverflowing(rulesRef.current) && currentFontSize > 0) {
          currentFontSize--;
          textRef.current.style.fontSize = `${currentFontSize}px`;
        }
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [rule]);

  return (
    <div
      className="flex mx-32 py-8 justify-center items-center h-screen text-white overflow-hidden pb-[72px] sm:pb-[72px] max-sm:pb-[144px]"
      ref={rulesRef}
    >
      <p
        className="font-bold text-center m-0 whitespace-pre-wrap caret-transparent"
        ref={textRef}
        style={{ fontSize: "10vh", lineHeight: "0.9" }}
      >
        {rule}
      </p>
    </div>
  );
};

export default Rules;
