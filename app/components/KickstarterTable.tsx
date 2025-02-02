import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '~/components/ui/table';
import { useMemo, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Project, projectsArraySchema } from '~/types/project';

const ITEMS_PER_PAGE = 5;
const API_URL =
    'https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json';

const KickstarterTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const jsonData = await response.json();

                // Validate data with Zod
                const validatedData = projectsArraySchema.safeParse(jsonData);

                if (!validatedData.success) {
                    throw new Error('Invalid data format received from API');
                }

                setData(validatedData.data);
                setIsLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setIsLoading(false);
            }
        })();
    }, []);

    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentData = data.slice(startIndex, endIndex);

    const getProgressSegments = (percentage: number) => {
        if (percentage <= 100) {
            return [{ width: percentage, color: 'bg-blue-600' }];
        }

        // For values over 100%, split into segments
        const segments = [
            { width: 100, color: 'bg-blue-400' }, // Base 100%
            { width: Math.min(percentage - 100, 100), color: 'bg-blue-700' }, // Next 100%
        ];

        // If over 200%, add more segments
        if (percentage > 200) {
            segments.push({ width: Math.min(percentage - 200, 100), color: 'bg-gray-800' }); // 200-300%
        }
        if (percentage > 300) {
            segments.push({ width: Math.min(percentage - 300, 100), color: 'bg-orange-600' }); // 300%+
        }

        return segments;
    };

    // Memoize all segments for current page data
    const segmentsMap = useMemo(() => {
        return currentData.reduce(
            (acc, project) => {
                acc[project['s.no']] = getProgressSegments(project['percentage.funded']);
                return acc;
            },
            {} as Record<number, Array<{ width: number; color: string }>>
        );
    }, [currentData]);

    const handleKeyNavigation = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft' && currentPage > 1) {
            setCurrentPage(page => Math.max(1, page - 1));
        } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
            setCurrentPage(page => Math.min(totalPages, page + 1));
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div
                    className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                    role="status"
                    aria-label="Loading projects"
                >
                    <span className="sr-only">Loading projects...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="flex items-center justify-center min-h-[400px]"
                role="alert"
                aria-live="assertive"
            >
                <div className="text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <Table aria-label="Kickstarter Projects">
                    <TableHeader>
                        <TableRow className="text-xs text-gray-700 uppercase bg-gray-50">
                            <TableHead className="px-6 py-3 font-semibold" scope="col">
                                S.No
                            </TableHead>
                            <TableHead className="px-6 py-3 font-semibold" scope="col">
                                Project
                            </TableHead>
                            <TableHead className="px-6 py-3 font-semibold" scope="col">
                                By
                            </TableHead>
                            <TableHead className="px-6 py-3 font-semibold min-w-80" scope="col">
                                Progress
                            </TableHead>
                            <TableHead className="px-6 py-3 font-semibold text-right" scope="col">
                                Amount Pledged
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentData.map(project => (
                            <TableRow
                                key={project['s.no']}
                                className="bg-white border-b hover:bg-gray-50"
                            >
                                <TableCell className="px-6 py-4 text-gray-900">
                                    {project['s.no']}
                                </TableCell>
                                <TableCell className="px-6 py-4 font-medium text-gray-900">
                                    <div className="font-semibold">{project.title}</div>
                                    <div className="text-sm text-gray-500">{project.location}</div>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-gray-600">
                                    {project.by}
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="flex w-full h-2.5 bg-gray-200 rounded-full overflow-hidden"
                                            role="group"
                                            aria-label={`Funding progress for ${project.title}`}
                                        >
                                            {segmentsMap[project['s.no']].map((segment, index) => (
                                                <div
                                                    key={index}
                                                    className={`flex flex-col justify-center overflow-hidden ${segment.color} text-xs text-white text-center whitespace-nowrap`}
                                                    style={{ width: `${segment.width}%` }}
                                                    role="progressbar"
                                                    aria-valuenow={segment.width}
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                    aria-label={`Progress segment ${index + 1}: ${segment.width}%`}
                                                />
                                            ))}
                                        </div>
                                        <span
                                            className="text-gray-600 whitespace-nowrap"
                                            aria-live="polite"
                                        >
                                            {project['percentage.funded']}%
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-right text-gray-900 font-medium">
                                    ${project['amt.pledged'].toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <nav
                className="flex items-center justify-between px-4 pb-4"
                aria-label="Table navigation"
                onKeyDown={handleKeyNavigation as any}
            >
                <div className="text-sm text-gray-700" aria-live="polite">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(endIndex, data.length)}</span> of{' '}
                    <span className="font-medium">{data.length}</span> results
                </div>
                <div
                    className="flex items-center gap-2"
                    role="group"
                    aria-label="Pagination controls"
                >
                    <button
                        onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                        disabled={currentPage === 1}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Go to previous page"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" aria-hidden="true" />
                        Previous
                    </button>
                    <div className="text-sm text-gray-700" aria-live="polite">
                        Page {currentPage} of {totalPages}
                    </div>
                    <button
                        onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Go to next page"
                    >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default KickstarterTable;
