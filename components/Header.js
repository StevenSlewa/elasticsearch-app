import Link from "next/link";

export default function Header() {
    return (
        <nav class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul class="flex flex-wrap justify-evenly -mb-px">
                <li class="mr-2">
                    <Link href="/" class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" aria-current="page">Upload</Link>
                </li>
                <li class="mr-2">
                    <Link href="/search" class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Search</Link>
                </li>
            </ul>
        </nav>
    );
}