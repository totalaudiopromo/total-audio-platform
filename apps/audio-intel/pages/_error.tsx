import { NextPage, NextPageContext } from 'next';

/**
 * Custom Error Page for Pages Router compatibility
 * Redirects to App Router's not-found.tsx for consistent 404 handling
 */

interface ErrorProps {
  statusCode: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">{statusCode}</h1>
        <p className="mt-4 text-xl text-gray-600">
          {statusCode === 404 ? 'Page not found' : 'An error occurred'}
        </p>
        <a
          href="/"
          className="mt-8 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode: statusCode ?? 500 };
};

export default Error;
