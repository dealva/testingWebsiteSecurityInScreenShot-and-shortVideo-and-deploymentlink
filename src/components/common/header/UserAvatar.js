import Image from "next/image";

export default function UserAvatar({ src = "/default-user.png", onClick }) {
  return (
    <button onClick={onClick} className="ml-4 rounded-full overflow-hidden w-10 h-10 border border-white">
      <Image src={src} alt="User Avatar" width={40} height={40} />
    </button>
  );
}
