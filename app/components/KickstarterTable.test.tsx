import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup, within } from '@testing-library/react';
import KickstarterTable from './KickstarterTable';
import '@testing-library/jest-dom';

const mockProjects = [
    {
        's.no': 0,
        'amt.pledged': 15823,
        blurb: 'Test project 1',
        by: 'Creator 1',
        country: 'US',
        currency: 'usd',
        'end.time': '2016-11-01T23:59:00-04:00',
        location: 'Washington, DC',
        'percentage.funded': 186,
        'num.backers': '219382',
        state: 'DC',
        title: 'Test Project 1',
        type: 'Town',
        url: '/projects/test1',
    },
    {
        's.no': 1,
        'amt.pledged': 6859,
        blurb: 'Test project 2',
        by: 'Creator 2',
        country: 'US',
        currency: 'usd',
        'end.time': '2016-11-25T01:13:33-05:00',
        location: 'Portland, OR',
        'percentage.funded': 8,
        'num.backers': '154926',
        state: 'OR',
        title: 'Test Project 2',
        type: 'Town',
        url: '/projects/test2',
    },
    // Add more mock projects to test pagination
    ...Array.from({ length: 8 }, (_, i) => ({
        's.no': i + 2,
        'amt.pledged': 10000 + i,
        blurb: `Test project ${i + 3}`,
        by: `Creator ${i + 3}`,
        country: 'US',
        currency: 'usd',
        'end.time': '2016-11-25T01:13:33-05:00',
        location: 'Test Location',
        'percentage.funded': 100 + i,
        'num.backers': '1000',
        state: 'ST',
        title: `Test Project ${i + 3}`,
        type: 'Town',
        url: `/projects/test${i + 3}`,
    })),
];

describe('KickstarterTable', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        global.fetch = vi.fn();
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('should show loading state initially', () => {
        render(<KickstarterTable />);
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render projects data correctly', async () => {
        // Mock successful API response
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => mockProjects,
        });

        render(<KickstarterTable />);

        // Wait for data to load
        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });

        // Check if first project is rendered
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
        expect(screen.getByText('Creator 1')).toBeInTheDocument();
        expect(screen.getByText('186%')).toBeInTheDocument();
    });

    it('should handle API error', async () => {
        // Mock failed API response
        (global.fetch as any).mockRejectedValueOnce(new Error('API Error'));

        render(<KickstarterTable />);

        await waitFor(() => {
            expect(screen.getByText(/error/i)).toBeInTheDocument();
        });
    });

    it('should handle pagination correctly', async () => {
        // Mock successful API response
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => mockProjects,
        });

        render(<KickstarterTable />);

        // Wait for data to load
        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });

        // Check initial page
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
        expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();

        // Go to next page
        await waitFor(() => {
            fireEvent.click(screen.getByText('Next'));
        });

        // Check second page
        expect(screen.getByText('Test Project 6')).toBeInTheDocument();
        expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();

        // Previous button should work
        await waitFor(() => {
            fireEvent.click(screen.getByText('Previous'));
        });
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    });

    it('should handle progress bar segments correctly', async () => {
        // Mock successful API response
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => mockProjects,
        });

        render(<KickstarterTable />);

        // Wait for data to load
        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });

        // Get all rows
        const rows = screen.getAllByRole('row').slice(1); // Skip header row

        // Check first project (186% funding - should have 2 segments)
        const firstProjectSegments = within(rows[0]).getAllByRole('progressbar');
        expect(firstProjectSegments).toHaveLength(2);
        expect(firstProjectSegments[0].getAttribute('aria-valuenow')).toBe('100');
        expect(firstProjectSegments[1].getAttribute('aria-valuenow')).toBe('86');

        // Check second project (8% funding - should have 1 segment)
        const secondProjectSegments = within(rows[1]).getAllByRole('progressbar');
        expect(secondProjectSegments).toHaveLength(1);
        expect(secondProjectSegments[0].getAttribute('aria-valuenow')).toBe('8');
    });

    it('should disable pagination buttons appropriately', async () => {
        // Mock successful API response
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => mockProjects,
        });

        render(<KickstarterTable />);

        // Wait for data to load
        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });

        // Previous should be disabled on first page
        expect(screen.getByText('Previous').closest('button')).toBeDisabled();
        expect(screen.getByText('Next').closest('button')).not.toBeDisabled();

        // Go to last page
        await waitFor(() => {
            fireEvent.click(screen.getByText('Next'));
        });

        // Next should be disabled on last page
        expect(screen.getByText('Previous').closest('button')).not.toBeDisabled();
        expect(screen.getByText('Next').closest('button')).toBeDisabled();
    });
});
