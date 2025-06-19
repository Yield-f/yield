"use client";
import React from "react";
import Link from "next/link";

const Error = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center font-montserrat">
      <p>We&apos;ve encountered a problem</p>
      <Link href="/dashboard" className="flex mt-2 underline">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Error;
