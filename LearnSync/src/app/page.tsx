import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>LearnSync</h1>
      <p>Open the student or teacher workspace to test UI/API wiring.</p>
      <p>
        <Link href="/student">Go to Student Workspace</Link>
      </p>
      <p>
        <Link href="/teacher">Go to Teacher Workspace</Link>
      </p>
      <p>
        <Link href="/health">Open Health Check</Link>
      </p>
    </main>
  );
}
