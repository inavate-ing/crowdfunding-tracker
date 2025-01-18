import type { MetaFunction } from '@remix-run/node';
import KickstarterTable from "~/components/KickstarterTable";

export const meta: MetaFunction = () => {
    return [
        { title: 'Kickstarter Projects' },
        { name: 'description', content: 'Discover highly-rated crowdfunding projects' },
    ];
};

export default function Index() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
            <div className="max-w-screen-2xl mx-auto p-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-purple-900 mb-3">
                        Kickstarter Projects
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Discover highly-rated crowdfunding projects
                    </p>
                </div>
                <div className="rounded-xl shadow-xl">
                    <KickstarterTable />
                </div>
            </div>
        </div>
    );
}
