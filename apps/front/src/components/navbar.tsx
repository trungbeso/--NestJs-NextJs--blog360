import Link from "next/link";

type Props = {};

export const Navbar = (prop: Props) => {
  return (
    <>
      <h1 className="text-2xl font-bold p-2">My Blog</h1>
      <div className="flex gap-2 ml-auto [&>a]:py-2 [&>a]:px-4 [&>a]:transition [&>a]:rounded-md [&>a:hover]:text-sky-100 [&>a:hover]:bg-sky-500]">
        <Link href="/" className="">
          Blog
        </Link>
        <Link href="#about" className="">
          About
        </Link>
        <Link href="#contact" className="">
          Contact
        </Link>
      </div>
    </>
  );
};
