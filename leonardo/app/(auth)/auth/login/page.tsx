import React from "react";
import Image from "next/image"; // $L2b tương ứng với Next.js Image component

// Các component con (Placeholders)
// $L2c: Form đăng nhập (chứa Cloudflare Turnstile để chống bot)
// $L2d: Hộp chứa thông tin tác giả ảnh (Credit Badge)
// $L2e: Component hiển thị tên người dùng (có hiệu ứng gradient)

export default function LoginPage() {
  return (
    <div className="relative bg-black/50">
      {/* 1. Lớp nền mờ (Blurred Background Layer) */}
      <Image
        src="/img/login-hero-images/Celestial.webp"
        alt="Enchanted Drift"
        width={4096}
        height={2304}
        unoptimized={false}
        style={{
          filter: "blur(1.5rem)",
          opacity: 0.24,
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          objectFit: "cover",
          borderTopRightRadius: "0.5rem",
          borderBottomRightRadius: "0.5rem",
        }}
        data-test-hidden={true}
      />

      {/* 2. Container chính */}
      <div className="relative flex min-h-full w-full p-2.5 md:min-h-screen md:p-10">
        {/* === PHẦN BÊN TRÁI: FORM ĐĂNG NHẬP === */}
        {/* $L2c: Auth Form Component */}
        {/* <AuthForm
          isAwsMarketplaceUser={false}
          cloudflareTurnstileSiteKey="0x4AAAAAAAjpS3rLKnsHyb79"
        /> */}

        {/* === PHẦN BÊN PHẢI: ẢNH MINH HỌA (Chỉ hiện trên Desktop) === */}
        <div className="lg:justify-flex-end lg-grow-0 relative hidden w-full grow items-end justify-center md:inline-flex">
          {/* Ảnh chính (Sắc nét) */}
          <Image
            src="/img/login-hero-images/Celestial.webp"
            alt="Enchanted Drift"
            width={4096}
            height={2304}
            unoptimized={false}
            style={{
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "100%",
              borderTopRightRadius: "0.5rem",
              borderBottomRightRadius: "0.5rem",
            }}
            data-test-hidden={true}
          />

          {/* Badge ghi công tác giả (Credit Box) */}
          {/* $L2d: Styled Box */}
          <div
            style={{
              borderRadius: 48,
              backgroundColor: "rgba(0, 0, 0, 0.35)",
              backdropFilter: "blur(1.5rem)",
              padding: "3.5px 1.125rem", // py px convert
              display: "inline-block",
              margin: "0 1.25rem 1rem 0", // mx mb
              position: "absolute",
              right: "0.5rem",
              textAlign: "center",
              fontSize: "small", // sm
              fontWeight: 500,
            }}
          >
            ‘Enchanted Drift’ by {/* $L2e: User Name Link */}
            <span className="text-gradient">@Celestial</span>
          </div>
        </div>
      </div>
    </div>
  );
}
