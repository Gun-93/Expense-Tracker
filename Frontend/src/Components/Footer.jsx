export default function Footer() {
  return (
    <footer className="bg-blue-800 text-white py-4 mt-8">
      <div className="max-w-7xl mx-auto px-4 flex justify-center items-center text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} ExpenseTracker. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

