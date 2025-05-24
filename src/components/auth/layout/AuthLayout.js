export default function AuthLayout({ children }) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
          {children}
        </div>
      </div>
    );
  }
  