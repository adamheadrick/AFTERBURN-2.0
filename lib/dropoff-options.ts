export const dropoffCategories = [
  "AAR Observation",
  "Exercise Summary Input",
  "Lesson Learned",
  "Best Practice",
  "Capability Gap",
  "Operational Friction",
  "Doctrine / Policy Reference",
  "Interagency Feedback",
  "Recommendation",
  "Supporting Document",
  "Other"
] as const;

export const dropoffModules = [
  "Planning",
  "Scenario",
  "Mission Assignment",
  "Objectives",
  "Sync Matrix",
  "Execution",
  "Observer Notes",
  "Hotwash",
  "AAR",
  "Executive Summary",
  "Doctrine / Library"
] as const;

export const dropoffFunctionalAreas = [
  "Command and Control",
  "Communications",
  "UAS / Counter-UAS",
  "Airspace",
  "Logistics",
  "Intelligence / Information Sharing",
  "Public Affairs",
  "Safety",
  "Legal / Authorities",
  "Operations",
  "Interagency Coordination",
  "Other"
] as const;

export const dropoffUrgencyLevels = ["Low", "Medium", "High", "Critical"] as const;

export const dropoffVisibilityRecommendations = [
  "Internal Review Only",
  "Exercise Team",
  "Entity-Specific",
  "Interagency Library Candidate",
  "Public/Unclassified Export Candidate"
] as const;

export const dropoffStatuses = [
  "Received",
  "AI Screening in Progress",
  "Cleared for Review",
  "Needs Human Review",
  "Potential Sensitive Content",
  "Rejected / Do Not Publish",
  "Sanitization Required",
  "Approved for Repository",
  "Added to Repository"
] as const;

export const dropoffRiskLevels = ["Low", "Medium", "High", "Critical"] as const;

export const repositoryItemTypes = [
  "Lesson Learned",
  "Best Practice",
  "Capability Gap",
  "Recommended Improvement",
  "Doctrine Reference",
  "Planning Consideration",
  "AAR Finding",
  "POA&M Item",
  "Future Exercise Inject",
  "Training Requirement",
  "Policy/Authorities Issue"
] as const;

export const repositoryItemStatuses = [
  "Open",
  "Under Review",
  "Adopted",
  "In Progress",
  "Closed",
  "Archived"
] as const;

export const repositoryExportEligibility = [
  "Internal Only",
  "Interagency Shareable",
  "Public/Unclassified"
] as const;

export type DropoffCategory = (typeof dropoffCategories)[number];
export type DropoffModule = (typeof dropoffModules)[number];
export type DropoffFunctionalArea = (typeof dropoffFunctionalAreas)[number];
export type DropoffUrgency = (typeof dropoffUrgencyLevels)[number];
export type DropoffVisibilityRecommendation = (typeof dropoffVisibilityRecommendations)[number];
export type DropoffStatus = (typeof dropoffStatuses)[number];
export type DropoffRiskLevel = (typeof dropoffRiskLevels)[number];
export type RepositoryItemType = (typeof repositoryItemTypes)[number];
export type RepositoryItemStatus = (typeof repositoryItemStatuses)[number];
export type RepositoryExportEligibility = (typeof repositoryExportEligibility)[number];
