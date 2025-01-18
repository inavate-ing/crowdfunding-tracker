import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '~/components/ui/table';
import data from '~/components/data';
import { useMemo } from 'react';

const KickstarterTable = () => {
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

    return (
        <div className="space-y-6">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow className="text-xs text-gray-700 uppercase bg-gray-50">
                            <TableHead className="px-6 py-3 font-semibold">Project</TableHead>
                            <TableHead className="px-6 py-3 font-semibold">By</TableHead>
                            <TableHead className="px-6 py-3 font-semibold min-w-80">
                                Progress
                            </TableHead>
                            <TableHead className="px-6 py-3 font-semibold text-right">
                                Amount Pledged
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map(project => {
                            const segments = useMemo(
                                () => getProgressSegments(project['percentage.funded']),
                                [project['percentage.funded']]
                            );

                            return (
                                <TableRow
                                    key={project['s.no']}
                                    className="bg-white border-b hover:bg-gray-50"
                                >
                                    <TableCell className="px-6 py-4 font-medium text-gray-900">
                                        <div className="font-semibold">{project.title}</div>
                                        <div className="text-sm text-gray-500">
                                            {project.location}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-gray-600">
                                        {project.by}
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                                {segments.map((segment, index) => (
                                                    <div
                                                        key={index}
                                                        className={`flex flex-col justify-center overflow-hidden ${segment.color} text-xs text-white text-center whitespace-nowrap`}
                                                        style={{ width: `${segment.width}%` }}
                                                        role="progressbar"
                                                        aria-valuenow={segment.width}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-gray-600 whitespace-nowrap">
                                                {project['percentage.funded']}%
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-right text-gray-900 font-medium">
                                        ${project['amt.pledged']}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default KickstarterTable;
