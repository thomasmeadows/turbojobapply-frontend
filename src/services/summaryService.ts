import axios from 'axios';
import type { Job, JobSummaryRequest, JobSummaryResponse } from '../types/job';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class SummaryService {
  /**
   * Extract ATS ID and type from a job object
   */
  static extractJobSummaryRequest(job: Job): JobSummaryRequest | null {
    // Check each ATS type for a valid ID
    if (job.bamboohr_requisition_id) {
      return {
        ats_id: job.bamboohr_requisition_id.toString(),
        ats_type: 'bamboo'
      };
    }
    
    if (job.workday_requisition_id) {
      return {
        ats_id: job.workday_requisition_id.toString(),
        ats_type: 'workday'
      };
    }
    
    if (job.greenhouseio_requisition_id) {
      return {
        ats_id: job.greenhouseio_requisition_id.toString(),
        ats_type: 'greenhouse'
      };
    }
    
    if (job.adp_requisition_id) {
      return {
        ats_id: job.adp_requisition_id.toString(),
        ats_type: 'adp'
      };
    }
    
    if (job.jobvite_requisition_id) {
      return {
        ats_id: job.jobvite_requisition_id.toString(),
        ats_type: 'jobvite'
      };
    }
    
    if (job.breezy_requisition_id) {
      return {
        ats_id: job.breezy_requisition_id.toString(),
        ats_type: 'breezy'
      };
    }
    
    if (job.lever_requisition_id) {
      return {
        ats_id: job.lever_requisition_id.toString(),
        ats_type: 'lever'
      };
    }
    
    if (job.smartrecruiters_requisition_id) {
      return {
        ats_id: job.smartrecruiters_requisition_id.toString(),
        ats_type: 'smartrecruiters'
      };
    }
    
    if (job.dover_requisition_id) {
      return {
        ats_id: job.dover_requisition_id.toString(),
        ats_type: 'dover'
      };
    }
    
    return null;
  }

  /**
   * Fetch summaries for multiple jobs
   */
  static async fetchJobSummaries(jobs: Job[]): Promise<Map<string, JobSummaryResponse>> {
    try {
      // Extract ATS information from jobs
      const summaryRequests: JobSummaryRequest[] = [];
      const jobIdMap = new Map<string, string>(); // maps ats_id to job.id
      
      jobs.forEach(job => {
        const request = this.extractJobSummaryRequest(job);
        if (request) {
          summaryRequests.push(request);
          jobIdMap.set(request.ats_id, job.id);
        }
      });

      if (summaryRequests.length === 0) {
        return new Map();
      }

      // Make API call
      const response = await axios.post(`${API_URL}/api/summaries/jobs`, {
        jobs: summaryRequests
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch summaries');
      }

      // Convert results to a map keyed by job.id for easy lookup
      const summaryMap = new Map<string, JobSummaryResponse>();
      
      response.data.data.forEach((summaryResponse: JobSummaryResponse) => {
        const jobId = jobIdMap.get(summaryResponse.ats_id);
        if (jobId) {
          summaryMap.set(jobId, summaryResponse);
        }
      });

      return summaryMap;
    } catch (error) {
      console.error('Error fetching job summaries:', error);
      throw error;
    }
  }

  /**
   * Fetch summary for a single job
   */
  static async fetchJobSummary(job: Job): Promise<JobSummaryResponse | null> {
    const summaryMap = await this.fetchJobSummaries([job]);
    return summaryMap.get(job.id) || null;
  }
}