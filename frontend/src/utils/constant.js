const deployLink = import.meta.env.VITE_RENDER_DEPLOY_LINK;

export const USER_API_END_POINT = `${deployLink}api/v1/user`;
export const JOB_API_END_POINT = `${deployLink}api/v1/job`;
export const APPLICATION_API_END_POINT = `${deployLink}api/v1/application`;
export const COMPANY_API_END_POINT = `${deployLink}api/v1/company`;