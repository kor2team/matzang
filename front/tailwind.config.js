/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        orange: {
          500: "rgb(255, 166, 57)", // 메인 오렌지 색상
          600: "#FF7F00", // 버튼 호버용 어두운 오렌지
        },
        gray: {
          100: "#f9f9f9", // 카드 및 배경용 연한 회색
          200: "#f0f0f0", // 드롭다운 호버 색상
          300: "#ddd", // 기본 테두리 색상
          400: "#ccc", // 큰 박스 테두리 색상
          800: "#333", // 다크 텍스트 색상
        },
        white: "#ffffff",
      },
      borderColor: {
        header: "rgb(255, 166, 57)", // 헤더 테두리 색상
        card: "#ddd", // 카드 및 기본 테두리 색상
        modal: "#ddd", // 모달 테두리 색상
        container: "#ccc", // 큰 박스 테두리 색상
      },
      boxShadow: {
        card: "0px 4px 6px rgba(0, 0, 0, 0.1)", // 카드 그림자
        modal: "0px 4px 8px rgba(0, 0, 0, 0.2)", // 모달 그림자
        dropdown: "0 2px 10px rgba(0, 0, 0, 0.1)", // 드롭다운 그림자
      },
      spacing: {
        5: "20px", // 상단 여백 (mt-5, mb-5 등으로 사용)
        4.5: "18px", // 일반 외부 여백 (mt-4.5 등으로 사용)
        3.5: "15px", // 카드 간격 등 (gap-3.5 등으로 사용)
        2.5: "10px", // 기본 패딩 등 (p-2.5 등으로 사용)
      },
      borderRadius: {
        sm: "4px", // 작은 둥근 모서리 (버튼, 카드 등)
        md: "8px", // 중간 둥근 모서리 (카드, 모달 등)
        lg: "10px", // 큰 둥근 모서리 (모달, 큰 박스 등)
        modal: "8px", // 모달 전용 둥근 모서리
      },
      width: {
        full: "100%", // 전체 너비
        maxW: "400px", // 모달 최대 너비
      },
      height: {
        maxh: "520px",
      },
      fontSize: {
        xl: "20px", // 헤더 텍스트 크기
        lg: "16px", // 버튼 텍스트 크기
      },
      maxWidth: {
        container: "900px", // 큰 박스 최대 너비
      },
    },
  },
  plugins: [],
};
