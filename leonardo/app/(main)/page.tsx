import { HomePromptBox } from "@/components/home-prompt-box";

export default function HeroSection() {
  return (
    <>
      {/* 1. Background Image với hiệu ứng Mask (làm mờ dần xuống dưới) */}
      <div
        id="hero-background"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 bg-[url('/img/new-background.webp')] mask-[linear-gradient(180deg,black_59.5%,transparent_100%)] bg-cover bg-center bg-no-repeat sm:min-h-75 lg:min-h-110 xl:min-h-141.5 2xl:min-h-[45.625rem]"
      />
      <div className="@container">
        <div>
          <div className="relative z-10 flex w-full flex-col items-center gap-12 px-0 pt-11 sm:px-3 sm:pb-3 md:px-8.5 md:pt-[3.09rem] md:pb-[2.09rem] lg:px-12.5 lg:pt-26.5 lg:pb-18 xl:px-17.5 xl:pt-30.5 xl:pb-[5.8rem]">
            {/* Tiêu đề chính */}
            <h1 className="text-heading-xl text-center leading-tight font-[700] md:text-[4.375rem] md:leading-25 xl:text-[5.625rem]">
              Let's Create
            </h1>

            {/* Thanh nhập liệu (Prompt Box) */}
            <div className="w-full max-w-4xl px-4">
              <HomePromptBox isAuthenticated={false} />
            </div>

            {/* Các gợi ý (Tags/Examples) */}
            {/* <Suggestions_L3d /> */}
          </div>
        </div>
      </div>

      {/* 2. Các thành phần header/nav ẩn danh */}
      {/* <HeaderComponent_L38 /> */}
      {/* <UnknownComponent_L39 /> */}

      {/* 3. Main Container (có kiểm tra trạng thái đăng nhập) */}
      {/* <AuthWrapper_L3a isAuthenticated={true}> */}
      {/* Wrapper kiểm tra xem có hiện box nhập liệu ở trang chủ không */}
      {/* <HomepagePromptWrapper_L3b isHomepagePromptBoxEnabled={true}> */}
      {/* Layout trung tâm chứa Tiêu đề và Input */}

      {/* </HomepagePromptWrapper_L3b> */}

      {/* Phần nội dung bên dưới (Gallery ảnh) */}
      <div className="relative z-10 mx-5 mt-8">{/* <Gallery_L3e /> */}</div>
      {/* </AuthWrapper_L3a> */}
    </>
  );
}
