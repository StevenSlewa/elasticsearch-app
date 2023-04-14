import Link from "next/link";

export default function Header() {
    return (
        <nav className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul className="flex flex-wrap justify-evenly -mb-px">
                <li className="mr-2">
                    <Link href="/" className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" aria-current="page">Upload</Link>
                </li>
                <li className="mr-2">
                    <Link href="/search" className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Search</Link>
                </li>
            </ul>
        </nav>
    );
}