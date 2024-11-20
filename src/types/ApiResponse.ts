import { IFeedback } from "@/models/feedback.model";

export interface APIResponse {
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    feedback?: IFeedback[];
}