import { describe, it, expect } from 'vitest';
import { projectSchema, projectsArraySchema } from './project';

describe('Project Schema Validation', () => {
    it('should validate a correct project object', () => {
        const validProject = {
            's.no': 0,
            'amt.pledged': 15823,
            blurb: 'Test project description',
            by: 'Test Creator',
            country: 'US',
            currency: 'usd',
            'end.time': '2016-11-01T23:59:00-04:00',
            location: 'Washington, DC',
            'percentage.funded': 186,
            'num.backers': '219382',
            state: 'DC',
            title: 'Test Project',
            type: 'Town',
            url: '/projects/test',
        };

        const result = projectSchema.safeParse(validProject);
        expect(result.success).toBe(true);
    });

    it('should reject invalid project object', () => {
        const invalidProject = {
            's.no': '0', // should be number
            'amt.pledged': '15823', // should be number
            // missing required fields
        };

        const result = projectSchema.safeParse(invalidProject);
        expect(result.success).toBe(false);
    });

    it('should validate array of projects', () => {
        const validProjects = [
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
        ];

        const result = projectsArraySchema.safeParse(validProjects);
        expect(result.success).toBe(true);
    });

    it('should reject invalid array of projects', () => {
        const invalidProjects = [
            {
                's.no': 0,
                // missing required fields
            },
            {
                's.no': '1', // should be number
                'amt.pledged': 'invalid', // should be number
            },
        ];

        const result = projectsArraySchema.safeParse(invalidProjects);
        expect(result.success).toBe(false);
    });
});
