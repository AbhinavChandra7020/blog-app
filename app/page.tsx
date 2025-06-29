import Image from "next/image";
import connectDB from "./_lib/db";

export default function Home() {
  console.log(process.env.MONGODB_URI)
  return (
    <div>
      hi there
    </div>
  );
}
