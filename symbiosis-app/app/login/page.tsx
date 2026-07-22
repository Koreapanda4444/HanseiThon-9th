"use client";

import { useRouter } from "next/navigation";
import { IconPlaceholder } from "@/components/icon-placeholder";
import { PrimaryButton } from "@/components/ui";

const BENEFITS = ["즐겨찾기 저장 및 동기화", "제보 내역 확인 및 관리", "맞춤형 추천 기능 이용"];

export default function LoginPage() {
  const router = useRouter();
  return (
    <main className="flex h-dvh flex-col bg-white">
      <header className="flex h-[52px] shrink-0 items-center px-3">
        <button
          type="button"
          aria-label="뒤로"
          onClick={() => router.push("/more")}
          className="flex h-9 w-9 items-center justify-center text-[var(--ink)]"
        >
          <IconPlaceholder size={18} />
        </button>
      </header>

      <div className="flex flex-1 flex-col justify-center gap-7 px-6 pb-16">
        <div className="text-center">
          <h1 className="text-[22px] font-extrabold text-[var(--ink)]">로그인 / 회원가입</h1>
          <p className="mt-1.5 text-[13.5px] text-[var(--sub)]">계정으로 더 편리하게 이용하세요</p>
        </div>

        <section className="rounded-2xl border border-[var(--line)] p-5">
          <h2 className="text-[14px] font-bold text-[var(--ink)]">계정으로 이용하면</h2>
          <ul className="mt-3 flex flex-col gap-2.5">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-[13.5px] text-[var(--ink)]">
                <span className="text-[var(--green)]">
                  <IconPlaceholder size={15} />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-2.5">
          <PrimaryButton>이메일로 시작하기</PrimaryButton>
          <button
            type="button"
            className="flex h-[50px] w-full items-center justify-center gap-2.5 rounded-xl border border-[var(--line)] bg-white text-[15px] font-semibold text-[var(--ink)]"
          >
            <IconPlaceholder size={17} />
            Google로 계속하기
          </button>
          <button
            type="button"
            className="flex h-[50px] w-full items-center justify-center gap-2.5 rounded-xl border border-[var(--line)] bg-white text-[15px] font-semibold text-[var(--ink)]"
          >
            <IconPlaceholder size={17} />
            Apple로 계속하기
          </button>
        </div>

        <p className="text-center text-[12px] leading-relaxed text-[var(--faint)]">
          로그인하면 <span className="font-semibold text-[var(--green-deep)] underline">이용약관</span> 및{" "}
          <span className="font-semibold text-[var(--green-deep)] underline">개인정보처리방침</span>에
          <br />
          동의하게 됩니다.
        </p>
      </div>
    </main>
  );
}
