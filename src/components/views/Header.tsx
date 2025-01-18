import logo from "data-base64:../../../assets/icon.png";

export default function Header() {
  return (
    <div className="p-4 flex items-center gap-x-4">
      <img src={logo} alt="logo" width={32} height={32} />
      <h1 className="text-2xl font-bold text-black">TalesTrove</h1>
    </div>
  );
}
