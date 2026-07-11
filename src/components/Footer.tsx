export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-8 py-4">
      <div className="max-w-3xl mx-auto px-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} KindAu — Built with fairness & kindness.
      </div>
    </footer>
  );
}
