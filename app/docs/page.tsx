import Link from "next/link";

export const revalidate = 3600; // revalidate every hour

export default function DocsPage() {
    const docs = [
        {
            title: "Getting Started",
            description: "Learn how to get started with the platform",
            href: "/docs/getting-started"
        },
        {
            title: "API Reference",
            description: "Reference for the API endpoints",
            href: "/docs/api-reference"
        },
        {
            title: "FAQ",
            description: "Frequently asked questions",
            href: "/docs/faq"
        }
    ]

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Docs</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {docs.map((doc) => (
                    <div key={doc.href} className="p-4 border border-gray-200 rounded-md">
                        <h2 className="text-lg font-bold">{doc.title}</h2>
                        <p className="text-sm text-gray-500">{doc.description}</p>
                        <Link href={doc.href} className="text-blue-500 hover:text-blue-700">Read More</Link>
                    </div>
                ))}
            </div>
            <p className="text-sm text-gray-500">Content last updated: {new Date().toLocaleString()}</p>
        </div>
    );
}