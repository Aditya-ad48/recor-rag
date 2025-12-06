"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, Plus, Settings, Send, MessageSquare, Trash2, Clock, FileText, X, ChevronRight, User, Bot, ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChatStore } from "./stores/useChatStore";

// --- 1. TYPE DEFINITIONS FOR YOUR JSON ---
type RelevantTurn = {
    turn_index: number;
    speaker: string;
    text: string;
};

type Evidence = {
    transcript_id: string;
    turn_numbers: number[];
    relevant_turns: RelevantTurn[];
};

type ConversationText = {
    text: string;
    id: string;
};

type BotAnswer = {
    answer: string;
    time: number;
    node_ids: string[];
    unique_text: ConversationText[];
    leave_text: ConversationText[];
};

type AnalysisResponse = {
    bot_answer: BotAnswer;
    evidence: Evidence[];
};

// --- 2. MOCK DATA (Your provided JSON) ---
// const MOCK_LLM_RESPONSE: AnalysisResponse = {
//     bot_answer: {
//         answer: "**Final Answer**\n\n- **Direct Answer:**  \n  Hotel bookings are canceled mainly because customers find the cancellation policies too restrictive, incur high fees for last\u2011minute cancellations, or are dissatisfied with service or location, prompting them to seek more flexible or cheaper alternatives.\n\n- **Key Incidents from Evidence:**  \n  - Ethan Clark canceled a Cozyinn reservation after learning the 24\u2011hour cancellation rule and felt the policy was less flexible than Marriott\u2019s.  \n  - Emma Roberts asked LuxStay about rescheduling within 24 hours to avoid fees and expressed frustration over potential charges.  \n  - Natalie Bailey questioned the higher fees for last\u2011minute cancellations at Cozyinn and compared them to Marriott\u2019s more lenient terms.  \n  - Noah Gomez canceled a suite at Cozyinn because a better deal was found at Hilton, accepting a 15\u202f% fee.  \n  - Madison Murphy and Mason Cook both complained about steep last\u2011minute cancellation fees and sought clarification or alternatives.  \n  - Aiden Hernandez canceled after a negative staff experience and considered Hilton for better service.  \n  - Nora Bailey and David Ross highlighted the 50\u202f% fee within 30 days or 24 hours and compared it unfavorably to competitors.  \n  - Several customers (e.g., Sebastian Baker, David Ross) confirmed cancellations after learning that fees apply unless the cancellation occurs more than 24\u202fhours before check\u2011in.\n\n- **Causal Explanation:**  \n  The cancellations stem from a mismatch between customer expectations and hotel policies. Hotels enforce higher fees for cancellations close to the stay to cover lost revenue and operational costs. When customers perceive these fees as excessive or the policy as inflexible\u2014especially compared to competitors with more lenient terms\u2014they opt to cancel. Additionally, dissatisfaction with service or location can trigger cancellations even when policies are clear.\n\n- **Cross\u2011Evidence Patterns:**  \n  - Consistent 24\u2011hour notice rule for full refunds or lower fees.  \n  - 50\u202f% fee for cancellations within 24\u202fhours or 30\u202fdays of arrival.  \n  - Loyalty tiers sometimes offer extended windows but rarely waive fees.  \n  - Customers frequently compare policies to Marriott or Hilton, citing those as more customer\u2011friendly.  \n  - Cancellation confirmations are typically sent via email after the agent processes the request.\n\n- **Contradictions or Missing Information:**  \n  - No evidence shows any policy exceptions beyond emergencies or medical issues.  \n  - The exact fee percentages vary slightly (48\u202f% vs 50\u202f%) but are consistently high for last\u2011minute cancellations.  \n  - Some customers mention \u201cflexibility\u201d offers (e.g., loyalty upgrades) that do not resolve the immediate cancellation need, indicating a gap between policy communication and customer expectations.\n\n- **Consolidated Interpretation:**  \n  Hotel cancellations",
//         node_ids: [
//             "7b6615b3-d580-479f-bdf7-75977ce20df0",
//             "754bd98b-8ef2-407f-bc7e-c50e231f24e0",
//             "90fabe04-99a6-4582-8d36-9e668809e212",
//             "fb66f879-03e7-4551-b97a-6b1fe38c3899",
//             "7a29714a-1003-4c98-ad62-643f4a7da7b0",
//             "9b9e2655-6f79-43c4-9fec-b7cacdf62d1f",
//             "d232f61f-978d-4dd9-b542-5f735dbd6775",
//             "c9e74ed9-3236-4e25-be5d-67b8be89cfdd",
//             "b1970b87-7db5-4fce-a3dc-422244dce92c",
//             "78851176-008d-4464-b1da-1957eacd586e",
//         ],
//         unique_text: [
//             {
//                 text: "[Domain]: Hotel [Intent]: Cancellation Policies [Reason]: Customer wanted to understand cancellation fees and policies for a booking at LuxStay Hotels.\n[Id]: 2b292d7f-1c0b-49c9-b27b-b7653bf2496c\n---\nIn this chat, David Ross contacted Luxstay Hotels to inquire about their cancellation fees and policies for a specific booking (Booking ID: bk one two three four five six seven). Emily Carter, the agent, explained that the fees depend on the timing of cancellation: a 50% fee applies for cancellations less than 24 hours before the reservation, while a flat $25 fee applies for cancellations made more than 24 hours in advance, regardless of the stay length. David expressed frustration about the high fees, particularly for last-minute cancellations, and compared Luxstay's policy to Hilton's, which he perceived as more flexible.\n\nThe agent empathized with David's frustration and apologized for any inconvenience. She also informed David that if he decides to keep the booking, he can modify it or change the dates, but only if done more than 24 hours in advance to avoid fees. David confirmed that he would still have to pay a 50% fee if he wanted to cancel within the 24-hour window. He inquired about the reasons for the high fees, to which the agent explained that they are based on occupancy rates and other factors affecting the hotel's ability to rebook the rooms quickly.\n\nDavid also asked if there were any exceptions for being a gold member, but the agent confirmed that the cancellation fees apply uniformly regardless of loyalty tier. David thanked the agent for her clarity and decided to proceed with the cancellation, aware of the 50% fee. The agent confirmed the cancellation and ended the call. The overall intent of the conversation was to understand and discuss the cancellation policies and fees for a Luxstay Hotel booking.",
//                 id: "7b6615b3-d580-479f-bdf7-75977ce20df0",
//             },
//             {
//                 text: "[Domain]: Hotel [Intent]: Cancellation Policies [Reason]: The customer called to inquire about cancellation fees and policies for last-minute bookings versus advance reservations.\n[Id]: 1af24b45-1acd-4cfc-bd30-4fbc3e5f87ce\n---\nThe customer, Mason Cook, contacted Cozyinn's customer service to inquire about cancellation fees, specifically for last-minute bookings compared to advance bookings. Ava Thompson, the agent, clarified that last-minute cancellations incur significantly higher fees, approximately 48% of the total booking amount. Mason expressed frustration about the high fees, especially for last-minute cancellations, and mentioned a recent cancellation of a suite booking.\n\nThe agent confirmed the cancellation fee for Mason's recent booking and explained that Cozyinn offers loyalty tier advantages, such as more flexible bookings for silver members, which could potentially reduce fees by offering a longer cancellation window. However, the agent admitted that there's no way to completely avoid the fees, and the earlier the cancellation is informed, the less the customer might have to pay.\n\nMason expressed a desire for clearer information upfront and mentioned better experiences with other hotels. The agent offered to send a summary of the policies and discussed the possibility of switching to earlier bookings without penalties. The agent also explained that switching to a deluxe suite would depend on availability, and if the customer cancels and rebooks early, there could be a chance to get a better rate, even for a last-minute change, potentially leading to lower cancellation fees.\n\nMason mentioned concerns about promotions easing these fees for future bookings, to which the agent responded that while promotional campaigns can enhance flexibility, they may not necessarily reduce cancellation fees directly. The call ended with the agent reminding Mason to reach out if he has any future booking concerns or questions. Mason thanked the agent for the help and expressed feeling more informed about Cozyinn's cancellation policies.",
//                 id: "754bd98b-8ef2-407f-bc7e-c50e231f24e0",
//             },
//             {
//                 text: "[Domain]: Hotel [Intent]: Cancellation Policies [Reason]: Customer requested cancellation of a hotel booking citing location inconvenience and better pricing elsewhere.\n[Id]: e2c82bd8-f526-4785-bee5-f8a77e50adad\n---\nCustomer Noah Gomez contacted Cozyinn to cancel a suite booking due to inconvenient location and a better deal found at Hilton nearby. The cancellation incurred a 15% cancellation fee, which will be deducted from the total booking amount. Noah expressed frustration about the fee, but was informed that the remaining balance would still be refunded. Cozyinn attempted to gather feedback through a survey, but Noah only wanted to cancel the booking. The cancellation was processed, and an email confirmation was sent. Noah was informed that the adjustment for the cancellation fee would be reflected within three to five business days. Noah did not have any further questions or concerns.",
//                 id: "90fabe04-99a6-4582-8d36-9e668809e212",
//             },
//             {
//                 text: "[Domain]: Hotel [Intent]: Cancellation Policies [Reason]: Natalie called to understand cancellation policies and associated fees for her recent booking at CozyInn in Chicago.\n[Id]: 17f3d46c-03b6-4e9c-a338-21049ccce994\n---\nCustomer Natalie Bailey contacted Cozyinn regarding booking bk 3298 045 in Chicago, expressing concern about cancellation policies. Agent Isabella Nguyen confirmed the booking and inquired about the specific issue. The customer was interested in understanding the difference in fees for last-minute versus advance cancellations.\n\nAgent explained that last-minute cancellations incur higher fees due to operational constraints, with fees typically being around 50% more than advance cancellations. The customer expressed frustration about the high fees, especially in case of emergencies.\n\nThe customer inquired about the possibility of a smaller penalty for last-minute cancellations, to which the agent explained that the fees are in place to cover costs incurred when rooms are held. The customer considered alternative hotels, such as Marriott, due to the perceived unfairness of the policy.\n\nThe customer asked for clarity on the notice required to avoid last-minute fees, with the agent confirming that at least 24 hours' notice is usually required, although emergencies are accounted for with the provision of documentation. The customer found this process overwhelming and inquired if all hotels make it that complicated.\n\nThe agent explained that policies vary among brands, with some, like Marriott, offering more flexible options based on loyalty tiers. The customer expressed further frustration and confusion. The customer requested a summary of the cancellation policy, to which the agent provided the following: last-minute cancellations have higher fees compared to advance ones, which are waived if the customer notifies the company within 24 hours. The agent also offered assistance with future bookings. The conversation ended with the customer seeking a clearer understanding of the policy.",
//                 id: "fb66f879-03e7-4551-b97a-6b1fe38c3899",
//             },
//             {
//                 text: "[Domain]: Hotel [Intent]: Cancellation Policies [Reason]: Inquiry about cancellation policies, specifically the possibility of rescheduling to avoid fees for a booking at LuxStay Hotels.\n[Id]: be6e9fab-4afa-4103-9f4f-6e7e9b13d4d4\n---\nEmma Roberts contacted Luxstay Hotels to inquire about cancellation policies for her booking (ID bk 3481 723) in Los Angeles. The agent confirmed that rescheduling without fees is possible within 24 hours of the original booking date, but outside of this period, cancellation fees may apply. Emma expressed frustration about the fees and asked if they could be waived, but the agent explained that this is not typically within their policy.\n\nThe agent offered Emma flexibility for rescheduling, providing options for available dates in the following weeks, with the same deluxe room amenities. Emma inquired about cancellation consequences and expressed a wish for better options or less fees. The agent acknowledged the frustration and mentioned that Luxstay's customer loyalty program offers certain discounts, which may help with cancellation fees. Emma is a silver member, and the agent offered to check if these discounts apply during rescheduling.\n\nEmma noted that the agent did not upsell any additional offers or services. The agent explained that the focus of the conversation was on clarifying the cancellation policy, and they could discuss other offers at a later time if Emma decides to proceed with the rescheduling or requires further assistance. The conversation ended with Emma considering her options and the agent offering to follow up on the loyalty program discounts. The overall intent of the contact was to understand the cancellation policies and explore rescheduling options. The final outcome is pending as Emma is still considering her options.",
//                 id: "7a29714a-1003-4c98-ad62-643f4a7da7b0",
//             },
//             {
//                 text: "[Domain]: Hotel [Intent]: Cancellation Policies [Reason]: Customer wants to cancel a hotel booking due to dissatisfaction with cancellation terms.\n[Id]: 5c329603-79f2-47dd-ac4d-2397af3fb314\n---\nCustomer Ethan Clark contacted Cozyinn to cancel a booking due to dissatisfaction with the cancellation policy, finding it restrictive and not flexible enough compared to Marriott's policy. The policy, which allows for cancellations up to 24 hours before check-in for a full refund, was clarified by the agent.\n\nEthan expressed a preference for flexibility in bookings and was offered an upgrade to gold loyalty status, which would enhance the experience and provide better cancellation terms in future bookings. However, this did not address Ethan's current issue, and he insisted on cancelling the booking.\n\nEthan provided the booking ID (bk 1245769) and confirmed the cancellation. He mentioned finding Cozyinn online while searching for options and considering switching to Marriott due to better cancellation options. Ethan indicated that the campaign did not significantly influence his view, but the policy was the main issue.\n\nThe cancellation was completed, and Ethan received an email confirmation. The agent expressed regret for not meeting Ethan's needs and offered assistance with more flexible options if Ethan reconsiders in the future. Ethan confirmed the cancellation and ended the conversation.",
//                 id: "9b9e2655-6f79-43c4-9fec-b7cacdf62d1f",
//             },
//             {
//                 text: "[Domain]: Hotel [Intent]: Cancellation Policies [Reason]: Customer is calling to cancel their hotel booking with CozyInn due to dissatisfaction with prior service.\n[Id]: 7a820f19-88da-43d1-948e-bc0fe0433251\n---\nCustomer Aiden Hernandez contacted Cozyinn to cancel booking BK 1234 567 due to dissatisfaction with staff service during a previous stay. The staff was perceived as unhelpful and slow, which did not meet Aiden's expectations. Aiden expressed frustration and a lack of feeling valued as a customer.\n\nAgent Michael Roberts attempted to resolve the issue by suggesting changing the date or room type, offering retention offers, and investigating improvements for future stays. However, Aiden was firm about wanting to cancel and was considering better rates at Hilton.\n\nThe cancellation process was initiated, and Aiden requested assurance that all charges would be stopped to avoid any future surprises. The cancellation is being processed, and Aiden has expressed a highly unlikely interest in future bookings with Cozyinn.\n\nThe overall intent of the contact was to cancel a booking due to dissatisfaction with staff service. The final outcome is that the cancellation is being processed, and Aiden has been informed of potential future improvements. Constraints include cancellation policies and staff service issues. The agent took actions such as initiating the cancellation, offering retention offers, and addressing Aiden's concerns about future charges. The tone was initially cooperative but became increasingly frustrated as the conversation progressed.",
//                 id: "d232f61f-978d-4dd9-b542-5f735dbd6775",
//             },
//             {
//                 text: "[Domain]: Hotel [Intent]: Cancellation Policies [Reason]: The customer wanted to inquire about the cancellation policy for her booking and discuss the strict cancellation fees applied.\n[Id]: 45842dfb-7545-409c-9a0a-c61b312b62ab\n---\nThe customer, Nora Bailey, contacted Beachfront Suites in Los Angeles to inquire about the cancellation policy for booking ID bk 6572 841, expressing concern about the high cancellation fee. The policy was explained as a 50% fee within 30 days of arrival. Nora compared this to Marriott's policies, finding them more flexible. She questioned the strictness of the policy, citing frustration due to a change in plans.\n\nThe agent, Emily Carter, explained that the policy is industry standard for deluxe rooms, due to booking commitments and assuring availability for other guests. Nora expressed that the policy was unfair and inapplicable to her case, as she was not facing extenuating circumstances. The agent confirmed that exceptions, such as waivers, are typically only granted for medical issues or emergencies.\n\nNora reiterated her frustration and considered switching to Marriott for future bookings. The agent acknowledged the desire for flexibility but emphasized the need to follow established policies. Nora then requested the cancellation, and the agent confirmed the 50% cancellation fee, which processes immediately upon confirmation.\n\nNora inquired about the possibility of reinstating the booking after cancellation, to which the agent responded negatively. Nora again expressed her dissatisfaction with the policy's rigidity. The agent, however, reiterated the need for strict policies to manage overall operations. Nora then agreed to proceed with the cancellation, and the agent confirmed that she would receive an email with the details shortly.\n\nThe customer ended the call, expressing hope for a quicker response in the future, and the agent thanked Nora for her patience. The final outcome was a cancellation of the booking, with the customer receiving an email confirmation. The core reason for contacting support was to inquire about the cancellation policy and request a cancellation.",
//                 id: "c9e74ed9-3236-4e25-be5d-67b8be89cfdd",
//             },
//             {
//                 text: "[Domain]: Hotel [Intent]: Cancellation Policies [Reason]: Customer called to discuss cancellation fees, particularly frustration with charges for last-minute cancellations versus advance bookings.\n[Id]: 313b5693-b4ec-498f-81af-693fd7219f20\n---\nCustomer Madison Murphy contacted Cozyinn to inquire about cancellation fees, specifically for last-minute cancellations. The conversation revolved around Cozyinn's cancellation policy, which imposes higher fees for last-minute cancellations compared to advance cancellations (50% vs 10%). Madison expressed frustration about the charges, feeling it was unfair and penalizing for circumstances beyond her control.\n\nThe agent explained that the policy is in place to manage bookings effectively, and competitors like Marriott may have more lenient cancellation policies. Madison also inquired about changing or rescheduling bookings to avoid last-minute fees, with the agent recommending at least 24 hours' notice to minimize fees.\n\nMadison expressed concerns about the policy's vagueness and repetitive responses, to which the agent acknowledged the feedback and promised to improve future interactions. The conversation ended with Madison confirming her cancellation process and the agent providing information on how to do so. The final outcome was that the customer was informed about the cancellation policy and the cancellation process.",
//                 id: "b1970b87-7db5-4fce-a3dc-422244dce92c",
//             },
//             {
//                 text: "[Domain]: Hotel [Intent]: Cancellation Policies [Reason]: Customer Sebastian Baker called to inquire about the cancellation policy for a LuxStay Hotels booking and express concerns regarding fees.\n[Id]: d853949f-632b-42aa-b6af-7e79f974a670\n---\nCustomer Sebastian Baker contacted Luxstay Hotels to inquire about the cancellation policy for booking ID bk 8942 218, a deluxe room booking in Los Angeles. He expressed frustration with the cancellation fees, specifically wanting to avoid them. The agent explained that the cancellation policy typically involves fees if cancellation occurs less than 24 hours before the stay, but offered rescheduling options as a way to mitigate those fees. Sebastian was interested in rescheduling but ultimately wanted to cancel without fees. The agent confirmed that it is possible to reschedule the booking, with the option to choose a new date within the next six months, and that there would be a fee for cancellation but a difference in rates if the new date has a higher price. Despite the agent's attempts to offer flexibility, Sebastian remained frustrated and requested to cancel the booking. The agent confirmed the cancellation policy and assured Sebastian that the cancellation would be processed right away.",
//                 id: "78851176-008d-4464-b1da-1957eacd586e",
//             },
//         ],
//         leave_text: [
//             {
//                 text: "[Domain]: Hotel [Intent]: Cancellation Policies [Reason]: Customer wanted to understand cancellation fees and policies for a booking at LuxStay Hotels.\n[Id]: 2b292d7f-1c0b-49c9-b27b-b7653bf2496c\n---\nIn this chat, David Ross contacted Luxstay Hotels to inquire about their cancellation fees and policies for a specific booking (Booking ID: bk one two three four five six seven). Emily Carter, the agent, explained that the fees depend on the timing of cancellation: a 50% fee applies for cancellations less than 24 hours before the reservation, while a flat $25 fee applies for cancellations made more than 24 hours in advance, regardless of the stay length. David expressed frustration about the high fees, particularly for last-minute cancellations, and compared Luxstay's policy to Hilton's, which he perceived as more flexible.\n\nThe agent empathized with David's frustration and apologized for any inconvenience. She also informed David that if he decides to keep the booking, he can modify it or change the dates, but only if done more than 24 hours in advance to avoid fees. David confirmed that he would still have to pay a 50% fee if he wanted to cancel within the 24-hour window. He inquired about the reasons for the high fees, to which the agent explained that they are based on occupancy rates and other factors affecting the hotel's ability to rebook the rooms quickly.\n\nDavid also asked if there were any exceptions for being a gold member, but the agent confirmed that the cancellation fees apply uniformly regardless of loyalty tier. David thanked the agent for her clarity and decided to proceed with the cancellation, aware of the 50% fee. The agent confirmed the cancellation and ended the call. The overall intent of the conversation was to understand and discuss the cancellation policies and fees for a Luxstay Hotel booking.",
//                 id: "7b6615b3-d580-479f-bdf7-75977ce20df0",
//             },
//             {
//                 text: "[Domain]: Hotel [Intent]: Cancellation Policies [Reason]: The customer called to inquire about cancellation fees and policies for last-minute bookings versus advance reservations.\n[Id]: 1af24b45-1acd-4cfc-bd30-4fbc3e5f87ce\n---\nThe customer, Mason Cook, contacted Cozyinn's customer service to inquire about cancellation fees, specifically for last-minute bookings compared to advance bookings. Ava Thompson, the agent, clarified that last-minute cancellations incur significantly higher fees, approximately 48% of the total booking amount. Mason expressed frustration about the high fees, especially for last-minute cancellations, and mentioned a recent cancellation of a suite booking.\n\nThe agent confirmed the cancellation fee for Mason's recent booking and explained that Cozyinn offers loyalty tier advantages, such as more flexible bookings for silver members, which could potentially reduce fees by offering a longer cancellation window. However, the agent admitted that there's no way to completely avoid the fees, and the earlier the cancellation is informed, the less the customer might have to pay.\n\nMason expressed a desire for clearer information upfront and mentioned better experiences with other hotels. The agent offered to send a summary of the policies and discussed the possibility of switching to earlier bookings without penalties. The agent also explained that switching to a deluxe suite would depend on availability, and if the customer cancels and rebooks early, there could be a chance to get a better rate, even for a last-minute change, potentially leading to lower cancellation fees.\n\nMason mentioned concerns about promotions easing these fees for future bookings, to which the agent responded that while promotional campaigns can enhance flexibility, they may not necessarily reduce cancellation fees directly. The call ended with the agent reminding Mason to reach out if he has any future booking concerns or questions. Mason thanked the agent for the help and expressed feeling more informed about Cozyinn's cancellation policies.",
//                 id: "754bd98b-8ef2-407f-bc7e-c50e231f24e0",
//             },
//             {
//                 text: "[Domain]: Hotel [Intent]: Cancellation Policies [Reason]: Customer requested cancellation of a hotel booking citing location inconvenience and better pricing elsewhere.\n[Id]: e2c82bd8-f526-4785-bee5-f8a77e50adad\n---\nCustomer Noah Gomez contacted Cozyinn to cancel a suite booking due to inconvenient location and a better deal found at Hilton nearby. The cancellation incurred a 15% cancellation fee, which will be deducted from the total booking amount. Noah expressed frustration about the fee, but was informed that the remaining balance would still be refunded. Cozyinn attempted to gather feedback through a survey, but Noah only wanted to cancel the booking. The cancellation was processed, and an email confirmation was sent. Noah was informed that the adjustment for the cancellation fee would be reflected within three to five business days. Noah did not have any further questions or concerns.",
//                 id: "90fabe04-99a6-4582-8d36-9e668809e212",
//             },
//             {
//                 text: "[Domain]: Hotel [Intent]: Cancellation Policies [Reason]: Natalie called to understand cancellation policies and associated fees for her recent booking at CozyInn in Chicago.\n[Id]: 17f3d46c-03b6-4e9c-a338-21049ccce994\n---\nCustomer Natalie Bailey contacted Cozyinn regarding booking bk 3298 045 in Chicago, expressing concern about cancellation policies. Agent Isabella Nguyen confirmed the booking and inquired about the specific issue. The customer was interested in understanding the difference in fees for last-minute versus advance cancellations.\n\nAgent explained that last-minute cancellations incur higher fees due to operational constraints, with fees typically being around 50% more than advance cancellations. The customer expressed frustration about the high fees, especially in case of emergencies.\n\nThe customer inquired about the possibility of a smaller penalty for last-minute cancellations, to which the agent explained that the fees are in place to cover costs incurred when rooms are held. The customer considered alternative hotels, such as Marriott, due to the perceived unfairness of the policy.\n\nThe customer asked for clarity on the notice required to avoid last-minute fees, with the agent confirming that at least 24 hours' notice is usually required, although emergencies are accounted for with the provision of documentation. The customer found this process overwhelming and inquired if all hotels make it that complicated.\n\nThe agent explained that policies vary among brands, with some, like Marriott, offering more flexible options based on loyalty tiers. The customer expressed further frustration and confusion. The customer requested a summary of the cancellation policy, to which the agent provided the following: last-minute cancellations have higher fees compared to advance ones, which are waived if the customer notifies the company within 24 hours. The agent also offered assistance with future bookings. The conversation ended with the customer seeking a clearer understanding of the policy.",
//                 id: "fb66f879-03e7-4551-b97a-6b1fe38c3899",
//             },
//             {
//                 text: "[Domain]: Hotel [Intent]: Cancellation Policies [Reason]: Inquiry about cancellation policies, specifically the possibility of rescheduling to avoid fees for a booking at LuxStay Hotels.\n[Id]: be6e9fab-4afa-4103-9f4f-6e7e9b13d4d4\n---\nEmma Roberts contacted Luxstay Hotels to inquire about cancellation policies for her booking (ID bk 3481 723) in Los Angeles. The agent confirmed that rescheduling without fees is possible within 24 hours of the original booking date, but outside of this period, cancellation fees may apply. Emma expressed frustration about the fees and asked if they could be waived, but the agent explained that this is not typically within their policy.\n\nThe agent offered Emma flexibility for rescheduling, providing options for available dates in the following weeks, with the same deluxe room amenities. Emma inquired about cancellation consequences and expressed a wish for better options or less fees. The agent acknowledged the frustration and mentioned that Luxstay's customer loyalty program offers certain discounts, which may help with cancellation fees. Emma is a silver member, and the agent offered to check if these discounts apply during rescheduling.\n\nEmma noted that the agent did not upsell any additional offers or services. The agent explained that the focus of the conversation was on clarifying the cancellation policy, and they could discuss other offers at a later time if Emma decides to proceed with the rescheduling or requires further assistance. The conversation ended with Emma considering her options and the agent offering to follow up on the loyalty program discounts. The overall intent of the contact was to understand the cancellation policies and explore rescheduling options. The final outcome is pending as Emma is still considering her options.",
//                 id: "7a29714a-1003-4c98-ad62-643f4a7da7b0",
//             },
//             {
//                 text: "[Domain]: Hotel [Intent]: Cancellation Policies [Reason]: Customer wants to cancel a hotel booking due to dissatisfaction with cancellation terms.\n[Id]: 5c329603-79f2-47dd-ac4d-2397af3fb314\n---\nCustomer Ethan Clark contacted Cozyinn to cancel a booking due to dissatisfaction with the cancellation policy, finding it restrictive and not flexible enough compared to Marriott's policy. The policy, which allows for cancellations up to 24 hours before check-in for a full refund, was clarified by the agent.\n\nEthan expressed a preference for flexibility in bookings and was offered an upgrade to gold loyalty status, which would enhance the experience and provide better cancellation terms in future bookings. However, this did not address Ethan's current issue, and he insisted on cancelling the booking.\n\nEthan provided the booking ID (bk 1245769) and confirmed the cancellation. He mentioned finding Cozyinn online while searching for options and considering switching to Marriott due to better cancellation options. Ethan indicated that the campaign did not significantly influence his view, but the policy was the main issue.\n\nThe cancellation was completed, and Ethan received an email confirmation. The agent expressed regret for not meeting Ethan's needs and offered assistance with more flexible options if Ethan reconsiders in the future. Ethan confirmed the cancellation and ended the conversation.",
//                 id: "9b9e2655-6f79-43c4-9fec-b7cacdf62d1f",
//             },
//             {
//                 text: "[Domain]: Hotel [Intent]: Cancellation Policies [Reason]: Customer is calling to cancel their hotel booking with CozyInn due to dissatisfaction with prior service.\n[Id]: 7a820f19-88da-43d1-948e-bc0fe0433251\n---\nCustomer Aiden Hernandez contacted Cozyinn to cancel booking BK 1234 567 due to dissatisfaction with staff service during a previous stay. The staff was perceived as unhelpful and slow, which did not meet Aiden's expectations. Aiden expressed frustration and a lack of feeling valued as a customer.\n\nAgent Michael Roberts attempted to resolve the issue by suggesting changing the date or room type, offering retention offers, and investigating improvements for future stays. However, Aiden was firm about wanting to cancel and was considering better rates at Hilton.\n\nThe cancellation process was initiated, and Aiden requested assurance that all charges would be stopped to avoid any future surprises. The cancellation is being processed, and Aiden has expressed a highly unlikely interest in future bookings with Cozyinn.\n\nThe overall intent of the contact was to cancel a booking due to dissatisfaction with staff service. The final outcome is that the cancellation is being processed, and Aiden has been informed of potential future improvements. Constraints include cancellation policies and staff service issues. The agent took actions such as initiating the cancellation, offering retention offers, and addressing Aiden's concerns about future charges. The tone was initially cooperative but became increasingly frustrated as the conversation progressed.",
//                 id: "d232f61f-978d-4dd9-b542-5f735dbd6775",
//             },
//             {
//                 text: "[Domain]: Hotel [Intent]: Cancellation Policies [Reason]: The customer wanted to inquire about the cancellation policy for her booking and discuss the strict cancellation fees applied.\n[Id]: 45842dfb-7545-409c-9a0a-c61b312b62ab\n---\nThe customer, Nora Bailey, contacted Beachfront Suites in Los Angeles to inquire about the cancellation policy for booking ID bk 6572 841, expressing concern about the high cancellation fee. The policy was explained as a 50% fee within 30 days of arrival. Nora compared this to Marriott's policies, finding them more flexible. She questioned the strictness of the policy, citing frustration due to a change in plans.\n\nThe agent, Emily Carter, explained that the policy is industry standard for deluxe rooms, due to booking commitments and assuring availability for other guests. Nora expressed that the policy was unfair and inapplicable to her case, as she was not facing extenuating circumstances. The agent confirmed that exceptions, such as waivers, are typically only granted for medical issues or emergencies.\n\nNora reiterated her frustration and considered switching to Marriott for future bookings. The agent acknowledged the desire for flexibility but emphasized the need to follow established policies. Nora then requested the cancellation, and the agent confirmed the 50% cancellation fee, which processes immediately upon confirmation.\n\nNora inquired about the possibility of reinstating the booking after cancellation, to which the agent responded negatively. Nora again expressed her dissatisfaction with the policy's rigidity. The agent, however, reiterated the need for strict policies to manage overall operations. Nora then agreed to proceed with the cancellation, and the agent confirmed that she would receive an email with the details shortly.\n\nThe customer ended the call, expressing hope for a quicker response in the future, and the agent thanked Nora for her patience. The final outcome was a cancellation of the booking, with the customer receiving an email confirmation. The core reason for contacting support was to inquire about the cancellation policy and request a cancellation.",
//                 id: "c9e74ed9-3236-4e25-be5d-67b8be89cfdd",
//             },
//             {
//                 text: "[Domain]: Hotel [Intent]: Cancellation Policies [Reason]: Customer called to discuss cancellation fees, particularly frustration with charges for last-minute cancellations versus advance bookings.\n[Id]: 313b5693-b4ec-498f-81af-693fd7219f20\n---\nCustomer Madison Murphy contacted Cozyinn to inquire about cancellation fees, specifically for last-minute cancellations. The conversation revolved around Cozyinn's cancellation policy, which imposes higher fees for last-minute cancellations compared to advance cancellations (50% vs 10%). Madison expressed frustration about the charges, feeling it was unfair and penalizing for circumstances beyond her control.\n\nThe agent explained that the policy is in place to manage bookings effectively, and competitors like Marriott may have more lenient cancellation policies. Madison also inquired about changing or rescheduling bookings to avoid last-minute fees, with the agent recommending at least 24 hours' notice to minimize fees.\n\nMadison expressed concerns about the policy's vagueness and repetitive responses, to which the agent acknowledged the feedback and promised to improve future interactions. The conversation ended with Madison confirming her cancellation process and the agent providing information on how to do so. The final outcome was that the customer was informed about the cancellation policy and the cancellation process.",
//                 id: "b1970b87-7db5-4fce-a3dc-422244dce92c",
//             },
//             {
//                 text: "[Domain]: Hotel [Intent]: Cancellation Policies [Reason]: Customer Sebastian Baker called to inquire about the cancellation policy for a LuxStay Hotels booking and express concerns regarding fees.\n[Id]: d853949f-632b-42aa-b6af-7e79f974a670\n---\nCustomer Sebastian Baker contacted Luxstay Hotels to inquire about the cancellation policy for booking ID bk 8942 218, a deluxe room booking in Los Angeles. He expressed frustration with the cancellation fees, specifically wanting to avoid them. The agent explained that the cancellation policy typically involves fees if cancellation occurs less than 24 hours before the stay, but offered rescheduling options as a way to mitigate those fees. Sebastian was interested in rescheduling but ultimately wanted to cancel without fees. The agent confirmed that it is possible to reschedule the booking, with the option to choose a new date within the next six months, and that there would be a fee for cancellation but a difference in rates if the new date has a higher price. Despite the agent's attempts to offer flexibility, Sebastian remained frustrated and requested to cancel the booking. The agent confirmed the cancellation policy and assured Sebastian that the cancellation would be processed right away.",
//                 id: "78851176-008d-4464-b1da-1957eacd586e",
//             },
//         ],
//         time: 211.42157173156738,
//     },
//     evidence: [
//         {
//             transcript_id: "2b292d7f-1c0b-49c9-b27b-b7653bf2496c",
//             turn_numbers: [1, 5, 23, 24, 25],
//             relevant_turns: [
//                 {
//                     turn_index: 1,
//                     speaker: "Customer",
//                     text: "hi this is david ross i wanted to understand the like cancellation fees and policies for my booking",
//                 },
//                 {
//                     turn_index: 5,
//                     speaker: "Customer",
//                     text: "right i heard that can you explain how the fees work like for last minute cancellations",
//                 },
//                 {
//                     turn_index: 23,
//                     speaker: "Customer",
//                     text: "you know that seems really frustrating why is it it so high",
//                 },
//                 {
//                     turn_index: 24,
//                     speaker: "Agent",
//                     text: "it\u2019s based on um occupancy rates and other factors you know uhh that impact our ability to rebook those rooms quickly",
//                 },
//                 {
//                     turn_index: 25,
//                     speaker: "Customer",
//                     text: "i guess that makes sense but it feels like all hotels are charging these high fees lately",
//                 },
//             ],
//         },
//         {
//             transcript_id: "1af24b45-1acd-4cfc-bd30-4fbc3e5f87ce",
//             turn_numbers: [1, 4, 10, 16, 25],
//             relevant_turns: [
//                 {
//                     turn_index: 1,
//                     speaker: "Customer",
//                     text: "hi ava this is mason um cook i wanted to ask about your cancellation fees especially for last minute bookings",
//                 },
//                 {
//                     turn_index: 4,
//                     speaker: "Agent",
//                     text: "got it so for last minute cancellations the fees are um significantly higher compared to advance cancellations it's i think about forty eight percent of the total booking amount",
//                 },
//                 {
//                     turn_index: 10,
//                     speaker: "Agent",
//                     text: "okay let me just pull that up one moment please a ah yes i see your booking so your cancellation fee would apply since it was a last minute cancellation",
//                 },
//                 {
//                     turn_index: 16,
//                     speaker: "Agent",
//                     text: "unfortunately mason there\u2019s just um no way to completely avoid the fees but the earlier you can inform us um the less you might have to pay",
//                 },
//                 {
//                     turn_index: 25,
//                     speaker: "Customer",
//                     text: "can that still lead to low cancellation fees",
//                 },
//             ],
//         },
//         {
//             transcript_id: "e2c82bd8-f526-4785-bee5-f8a77e50adad",
//             turn_numbers: [1, 2, 3, 8, 12],
//             relevant_turns: [
//                 {
//                     turn_index: 1,
//                     speaker: "Customer",
//                     text: "hi james uh this is noah noah gomez i\u2019m calling to uh cancel my um booking",
//                 },
//                 {
//                     turn_index: 2,
//                     speaker: "Agent",
//                     text: "i'm sorry uh to hear that noah may i um know the reason for the cancellation",
//                 },
//                 {
//                     turn_index: 3,
//                     speaker: "Customer",
//                     text: "yeah uh the location is just not convenient you know i found a better deal at hilton nearby uh",
//                 },
//                 {
//                     turn_index: 8,
//                     speaker: "Agent",
//                     text: "i see definitely understandable let me explain our uh cancellation policy for you",
//                 },
//                 {
//                     turn_index: 12,
//                     speaker: "Agent",
//                     text: "alright um it looks like there\u2019s a cancellation fee you know due to the timing which is actually um fifteen percent of like the total",
//                 },
//             ],
//         },
//         {
//             transcript_id: "17f3d46c-03b6-4e9c-a338-21049ccce994",
//             turn_numbers: [6, 8, 12, 18, 20],
//             relevant_turns: [
//                 {
//                     turn_index: 6,
//                     speaker: "Agent",
//                     text: "ah okay so i can help with that last minute cancellations usually incur higher fees um due to operational constraints",
//                 },
//                 {
//                     turn_index: 8,
//                     speaker: "Agent",
//                     text: "i understand this is frustrating generally last minute fees can be significantly higher uh often around like fifty percent more than advance cancellations actually sorry i meant i guess it's about fifty percent more",
//                 },
//                 {
//                     turn_index: 12,
//                     speaker: "Agent",
//                     text: "i can see why you\u2019d think that it's um stressful but the fees are in place to help cover the costs incurred when rooms are held",
//                 },
//                 {
//                     turn_index: 18,
//                     speaker: "Agent",
//                     text: "normally we require at least twenty four hours notice to waive these fees does that um help",
//                 },
//                 {
//                     turn_index: 20,
//                     speaker: "Agent",
//                     text: "emergencies are accounted for but you will typically need to provide documentation it\u2019s all uh part of the policy checklist",
//                 },
//             ],
//         },
//         {
//             transcript_id: "be6e9fab-4afa-4103-9f4f-6e7e9b13d4d4",
//             turn_numbers: [3, 7, 8, 9, 10],
//             relevant_turns: [
//                 {
//                     turn_index: 3,
//                     speaker: "Customer",
//                     text: "yeah uh i'm calling to inquire about cancellation policies for my booking uh in los angeles",
//                 },
//                 {
//                     turn_index: 7,
//                     speaker: "Customer",
//                     text: "exactly uh i need to know if if i can reschedule to avoid cancellation fees",
//                 },
//                 {
//                     turn_index: 8,
//                     speaker: "Agent",
//                     text: "right i can help with that our cancellation policy does allow for um rescheduling without fees under certain conditions",
//                 },
//                 {
//                     turn_index: 9,
//                     speaker: "Customer",
//                     text: "oh really what conditions apply",
//                 },
//                 {
//                     turn_index: 10,
//                     speaker: "Agent",
//                     text: "well if you um reschedule within twenty four hours of uh your original booking date there's no fee otherwise a cancellation fee could apply uh typically",
//                 },
//             ],
//         },
//         {
//             transcript_id: "5c329603-79f2-47dd-ac4d-2397af3fb314",
//             turn_numbers: [4, 5, 6, 8, 18],
//             relevant_turns: [
//                 {
//                     turn_index: 4,
//                     speaker: "Agent",
//                     text: "thank you ethan and um can i ask the reason for your cancellation",
//                 },
//                 {
//                     turn_index: 5,
//                     speaker: "Customer",
//                     text: "uh yeah i\u2019m just not happy um with the cancellation policy you guys have",
//                 },
//                 {
//                     turn_index: 6,
//                     speaker: "Agent",
//                     text: "i understand actually the cancellation terms they can uh sometimes be confusing would you like me to clarify them for you",
//                 },
//                 {
//                     turn_index: 8,
//                     speaker: "Agent",
//                     text: "okay our policy uh it typically allows for cancellations up to twenty four hours before um check in for a full refund but i mean i know it can feel limiting especially if plans change um suddenly",
//                 },
//                 {
//                     turn_index: 18,
//                     speaker: "Agent",
//                     text: "thank you so just to summarize you're cancelling due to dissatisfaction with our cancellation policy right",
//                 },
//             ],
//         },
//         {
//             transcript_id: "7a820f19-88da-43d1-948e-bc0fe0433251",
//             turn_numbers: [1, 4, 5, 8, 10],
//             relevant_turns: [
//                 {
//                     turn_index: 1,
//                     speaker: "Customer",
//                     text: "hi this is aiden hernandez um i\u2019m calling to uh cancel my booking option",
//                 },
//                 {
//                     turn_index: 4,
//                     speaker: "Agent",
//                     text: "thank you aiden um just so you know can i ask what prompted this cancellation",
//                 },
//                 {
//                     turn_index: 5,
//                     speaker: "Customer",
//                     text: "well honestly it\u2019s due to some you know issues with the staff last time it really wasn\u2019t up to um standard",
//                 },
//                 {
//                     turn_index: 8,
//                     speaker: "Agent",
//                     text: "i apologize for that experience aiden uh have you considered changing the date or perhaps a different room type instead",
//                 },
//                 {
//                     turn_index: 10,
//                     speaker: "Agent",
//                     text: "i see so you're looking at hilton just so you know we do have some cancellation policies that could work for you okay",
//                 },
//             ],
//         },
//         {
//             transcript_id: "45842dfb-7545-409c-9a0a-c61b312b62ab",
//             turn_numbers: [4, 7, 8, 12, 16],
//             relevant_turns: [
//                 {
//                     turn_index: 4,
//                     speaker: "Agent",
//                     text: "right let me pull that up so our policy states that if you cancel you know within thirty days of your arrival you'll incur a cancellation fee of fifty percent uh of your total you know booking cost",
//                 },
//                 {
//                     turn_index: 7,
//                     speaker: "Customer",
//                     text: "well it seems a bit rigid can you um explain why it's like so strict",
//                 },
//                 {
//                     turn_index: 8,
//                     speaker: "Agent",
//                     text: "sure we have to adhere to specific uh booking commitments and assure availability for other guests that\u2019s um a common practice in the industry",
//                 },
//                 {
//                     turn_index: 12,
//                     speaker: "Agent",
//                     text: "typically we do not waive fees unless there are extenuating circumstances like a medical issue or um emergency",
//                 },
//                 {
//                     turn_index: 16,
//                     speaker: "Agent",
//                     text: "you'll get charged that fifty percent fee right away cancelling um means you\u2019ll be responsible for like that charge",
//                 },
//             ],
//         },
//         {
//             transcript_id: "313b5693-b4ec-498f-81af-693fd7219f20",
//             turn_numbers: [1, 4, 7, 10, 21],
//             relevant_turns: [
//                 {
//                     turn_index: 1,
//                     speaker: "Customer",
//                     text: "hi um this is madison murphy i\u2019m calling about cancellation fees particularly uh for last minute cancellations",
//                 },
//                 {
//                     turn_index: 4,
//                     speaker: "Agent",
//                     text: "i understand that you're asking specifically about uh our cancellation policy um for last minute cancellations right",
//                 },
//                 {
//                     turn_index: 7,
//                     speaker: "Customer",
//                     text: "yeah i um noticed that it's like why should i be penalized for things out of my control",
//                 },
//                 {
//                     turn_index: 10,
//                     speaker: "Agent",
//                     text: "sure umm for last minute cancellations it can be around uh fifty percent of the total charges whereas advance cancellations only have a um ten percent fee",
//                 },
//                 {
//                     turn_index: 21,
//                     speaker: "Customer",
//                     text: "but what about my options if i wanted to change my booking or um push it further out you know",
//                 },
//             ],
//         },
//         {
//             transcript_id: "d853949f-632b-42aa-b6af-7e79f974a670",
//             turn_numbers: [3, 8, 10, 13, 28],
//             relevant_turns: [
//                 {
//                     turn_index: 3,
//                     speaker: "Customer",
//                     text: "yes uh the cancellation policy for my booking",
//                 },
//                 {
//                     turn_index: 8,
//                     speaker: "Agent",
//                     text: "well i just want to know um uh about the fees if i decide to cancel i\u2019m like a bit frustrated with them",
//                 },
//                 {
//                     turn_index: 10,
//                     speaker: "Customer",
//                     text: "yes but isn\u2019t there a way to like avoid these fees",
//                 },
//                 {
//                     turn_index: 13,
//                     speaker: "Agent",
//                     text: "like cancel without fees at all",
//                 },
//                 {
//                     turn_index: 28,
//                     speaker: "Customer",
//                     text: "no i just i just want to cancel and be done with it",
//                 },
//             ],
//         },
//     ],
// };

const MOCK_LLM_RESPONSE: AnalysisResponse = {
    bot_answer: {
        answer: "**Final Answer**\n\n- **Direct Answer:** \n  Hotel bookings are canceled mainly because customers find the cancellation policies too restrictive, incur high fees for last\u2011minute cancellations, or are dissatisfied with service or location, prompting them to seek more flexible or cheaper alternatives.\n\n- **Key Incidents from Evidence:** \n  - Ethan Clark canceled a Cozyinn reservation after learning the 24\u2011hour cancellation rule and felt the policy was less flexible than Marriott\u2019s.  \n  - Emma Roberts asked LuxStay about rescheduling within 24 hours to avoid fees and expressed frustration over potential charges.  \n  - Natalie Bailey questioned the higher fees for last\u2011minute cancellations at Cozyinn and compared them to Marriott\u2019s more lenient terms.  \n  - Noah Gomez canceled a suite at Cozyinn because a better deal was found at Hilton, accepting a 15\u202f% fee.  \n  - Madison Murphy and Mason Cook both complained about steep last\u2011minute cancellation fees and sought clarification or alternatives.  \n  - Aiden Hernandez canceled after a negative staff experience and considered Hilton for better service.  \n  - Nora Bailey and David Ross highlighted the 50\u202f% fee within 30 days or 24 hours and compared it unfavorably to competitors.  \n  - Several customers (e.g., Sebastian Baker, David Ross) confirmed cancellations after learning that fees apply unless the cancellation occurs more than 24\u202fhours before check\u2011in.\n\n- **Causal Explanation:** \n  The cancellations stem from a mismatch between customer expectations and hotel policies. Hotels enforce higher fees for cancellations close to the stay to cover lost revenue and operational costs. When customers perceive these fees as excessive or the policy as inflexible\u2014especially compared to competitors with more lenient terms\u2014they opt to cancel. Additionally, dissatisfaction with service or location can trigger cancellations even when policies are clear.\n\n- **Cross\u2011Evidence Patterns:** \n  - Consistent 24\u2011hour notice rule for full refunds or lower fees.  \n  - 50\u202f% fee for cancellations within 24\u202fhours or 30\u202fdays of arrival.  \n  - Loyalty tiers sometimes offer extended windows but rarely waive fees.  \n  - Customers frequently compare policies to Marriott or Hilton, citing those as more customer\u2011friendly.  \n  - Cancellation confirmations are typically sent via email after the agent processes the request.\n\n- **Contradictions or Missing Information:** \n  - No evidence shows any policy exceptions beyond emergencies or medical issues.  \n  - The exact fee percentages vary slightly (48\u202f% vs 50\u202f%) but are consistently high for last\u2011minute cancellations.  \n  - Some customers mention \u201cflexibility\u201d offers (e.g., loyalty upgrades) that do not resolve the immediate cancellation need, indicating a gap between policy communication and customer expectations.\n\n- **Consolidated Interpretation:** \n  Hotel cancellations",
        node_ids: [
            "7b6615b3-d580-479f-bdf7-75977ce20df0",
            "754bd98b-8ef2-407f-bc7e-c50e231f24e0",
            "90fabe04-99a6-4582-8d36-9e668809e212",
            "fb66f879-03e7-4551-b97a-6b1fe38c3899",
            "7a29714a-1003-4c98-ad62-643f4a7da7b0",
            "9b9e2655-6f79-43c4-9fec-b7cacdf62d1f",
            "d232f61f-978d-4dd9-b542-5f735dbd6775",
            "c9e74ed9-3236-4e25-be5d-67b8be89cfdd",
            "b1970b87-7db5-4fce-a3dc-422244dce92c",
            "78851176-008d-4464-b1da-1957eacd586e",
        ],
        unique_text: [],
        leave_text: [
            {
                id: "2b292d7f-1c0b-49c9-b27b-b7653bf2496c",
                text: "Customer: hi this is david ross i wanted to understand the like cancellation fees and policies for my booking\nAgent: Hello David, I'd be happy to help with that. Could you provide your booking ID?\nCustomer: It's bk one two three four five six seven.\nAgent: Thank you. I see your booking here. What specific questions do you have?\nCustomer: right i heard that can you explain how the fees work like for last minute cancellations\nAgent: Certainly. If you cancel less than 24 hours before your reservation, there is a 50% cancellation fee.\nCustomer: And if it's more than 24 hours?\nAgent: Then it's just a flat $25 fee.\nCustomer: I see. And what counts as last minute exactly?\nAgent: Anything within that 24-hour window before check-in time, which is 3 PM.\nCustomer: Okay. I'm actually thinking of cancelling now, which is within that window.\nAgent: I understand. In that case, the 50% fee would apply.\nCustomer: That's quite a lot. Is there any way around it?\nAgent: Unfortunately, that is the standard policy for this rate type.\nCustomer: Even for Gold members?\nAgent: Yes, the cancellation fees apply uniformly regardless of loyalty tier.\nCustomer: I'm really not happy about this.\nAgent: I apologize for the frustration, David.\nCustomer: My flight was delayed, that's why I'm cancelling.\nAgent: I'm sorry to hear that. Do you have travel insurance?\nCustomer: No, I don't.\nAgent: Sometimes these fees can be claimed if you do.\nCustomer: you know that seems really frustrating why is it it so high\nAgent: it’s based on um occupancy rates and other factors you know uhh that impact our ability to rebook those rooms quickly\nCustomer: i guess that makes sense but it feels like all hotels are charging these high fees lately\nAgent: We try to be competitive, but we also have to manage our inventory. Do you still want to proceed with the cancellation?\nCustomer: Yes, go ahead.\nAgent: Cancellation confirmed. You will receive an email shortly.",
            },
            {
                id: "1af24b45-1acd-4cfc-bd30-4fbc3e5f87ce",
                text: "Customer: hi ava this is mason um cook i wanted to ask about your cancellation fees especially for last minute bookings\nAgent: Hi Mason, thanks for calling CozyInn. I can certainly explain that for you.\nCustomer: Great, because I was looking at my statement.\nAgent: got it so for last minute cancellations the fees are um significantly higher compared to advance cancellations it's i think about forty eight percent of the total booking amount\nCustomer: Forty-eight percent? That's nearly half!\nAgent: Yes, it is a significant portion. This applies when cancellations happen within 24 hours of arrival.\nCustomer: I had to cancel because of a work emergency.\nAgent: I understand, unexpected things happen.\nCustomer: Is there no grace period?\nAgent: okay let me just pull that up one moment please a ah yes i see your booking so your cancellation fee would apply since it was a last minute cancellation\nCustomer: But I'm a Silver member. Doesn't that count for something?\nAgent: Loyalty status does offer perks, usually related to room upgrades or earning points.\nCustomer: So no help with fees?\nAgent: unfortunately mason there’s just um no way to completely avoid the fees but the earlier you can inform us um the less you might have to pay\nCustomer: I called as soon as I knew.\nAgent: We appreciate that.\nCustomer: What if I rebook for next week?\nAgent: We could potentially apply the balance to a future stay, but the fee might still stand for this transaction.\nCustomer: That's not very flexible.\nAgent: I can send you a policy summary if that helps clarify things for the future.\nCustomer: Sure, send it.\nCustomer: can that still lead to low cancellation fees\nAgent: Potentially, if you book a flexible rate next time, the fees are lower or non-existent with enough notice.\nCustomer: Okay, thanks for the info.\nAgent: You're welcome, Mason. Have a good day.",
            },
            {
                id: "e2c82bd8-f526-4785-bee5-f8a77e50adad",
                text: "Customer: hi james uh this is noah noah gomez i’m calling to uh cancel my um booking\nAgent: i'm sorry uh to hear that noah may i um know the reason for the cancellation\nCustomer: yeah uh the location is just not convenient you know i found a better deal at hilton nearby uh\nAgent: Oh, I see. We strive to offer competitive rates and great locations.\nCustomer: Yeah, but this one is right next to my conference center.\nAgent: That makes sense. Convenience is key.\nCustomer: Exactly. So I need to cancel this one.\nAgent: i see definitely understandable let me explain our uh cancellation policy for you\nCustomer: Is there a fee?\nAgent: Since you are cancelling within the penalty window, yes.\nCustomer: How much is it?\nAgent: alright um it looks like there’s a cancellation fee you know due to the timing which is actually um fifteen percent of like the total\nCustomer: Fifteen percent isn't too bad, I guess. Better than full price.\nAgent: Yes, it's a partial charge to cover the hold on the room.\nCustomer: Go ahead and process it.\nAgent: Processing now...\nAgent: Done. The refund of the remaining balance will appear in 3-5 business days.\nCustomer: Thanks James.\nAgent: You're welcome, Noah.",
            },
            {
                id: "17f3d46c-03b6-4e9c-a338-21049ccce994",
                text: "Agent: Thank you for calling CozyInn. This is Isabella.\nCustomer: Hi, I'm calling about booking bk 3298 045.\nAgent: I see it here. How can I assist?\nCustomer: I need to cancel, but I'm worried about the fees.\nAgent: ah okay so i can help with that last minute cancellations usually incur higher fees um due to operational constraints\nCustomer: How high are we talking?\nAgent: i understand this is frustrating generally last minute fees can be significantly higher uh often around like fifty percent more than advance cancellations actually sorry i meant i guess it's about fifty percent more\nCustomer: That seems excessive.\nAgent: It is standard for this season due to high demand.\nCustomer: I have a medical emergency.\nAgent: i can see why you’d think that it's um stressful but the fees are in place to help cover the costs incurred when rooms are held\nCustomer: Even for emergencies?\nAgent: normally we require at least twenty four hours notice to waive these fees does that um help\nCustomer: I didn't have 24 hours notice of my emergency.\nAgent: emergencies are accounted for but you will typically need to provide documentation it’s all uh part of the policy checklist\nCustomer: I can provide a doctor's note.\nAgent: That would be helpful. Please email it to claims@cozyinn.com.\nCustomer: I will do that. Will that waive the fee?\nAgent: It goes to review, but typically yes.\nCustomer: Okay, I'll send it now.",
            },
            {
                id: "be6e9fab-4afa-4103-9f4f-6e7e9b13d4d4",
                text: "Agent: LuxStay Hotels, this is Sarah.\nCustomer: yeah uh i'm calling to inquire about cancellation policies for my booking uh in los angeles\nAgent: I can pull that up. What is your booking ID?\nCustomer: It's bk 3481 723.\nAgent: Thank you, Emma. I see your reservation for next Tuesday.\nCustomer: Right. I might need to move it.\nCustomer: exactly uh i need to know if if i can reschedule to avoid cancellation fees\nAgent: right i can help with that our cancellation policy does allow for um rescheduling without fees under certain conditions\nCustomer: oh really what conditions apply\nAgent: well if you um reschedule within twenty four hours of uh your original booking date there's no fee otherwise a cancellation fee could apply uh typically\nCustomer: I booked it two days ago.\nAgent: Ah, in that case, the 24-hour grace period has passed.\nCustomer: So I have to pay to move it?\nAgent: There might be a modification fee, but it's usually less than a full cancellation fee.\nCustomer: How much is the modification fee?\nAgent: It's $50.\nCustomer: Okay, that's better than losing the whole deposit.\nAgent: Would you like to check availability for new dates?\nCustomer: Yes, let's look at the following week.\nAgent: Checking now... Yes, we have availability.",
            },
            {
                id: "5c329603-79f2-47dd-ac4d-2397af3fb314",
                text: "Agent: CozyInn Support, this is Mark.\nCustomer: Hi, I need to cancel my reservation.\nAgent: thank you ethan and um can i ask the reason for your cancellation\nCustomer: uh yeah i’m just not happy um with the cancellation policy you guys have\nAgent: i understand actually the cancellation terms they can uh sometimes be confusing would you like me to clarify them for you\nCustomer: No, I read them. They just seem very strict compared to Marriott.\nAgent: okay our policy uh it typically allows for cancellations up to twenty four hours before um check in for a full refund but i mean i know it can feel limiting especially if plans change um suddenly\nCustomer: Exactly. Sometimes plans change same-day.\nAgent: We do offer a 'Flex' rate that allows same-day cancellation, but your booking was at the 'Standard' rate.\nCustomer: I didn't see that option.\nAgent: It's usually a bit higher in price.\nCustomer: Well, I'm cancelling this one anyway.\nAgent: thank you so just to summarize you're cancelling due to dissatisfaction with our cancellation policy right\nCustomer: Yes.\nAgent: I will process that for you. You should see the confirmation email soon.",
            },
            {
                id: "7a820f19-88da-43d1-948e-bc0fe0433251",
                text: "Customer: hi this is aiden hernandez um i’m calling to uh cancel my booking option\nAgent: Hello Aiden. I can help with that.\nAgent: thank you aiden um just so you know can i ask what prompted this cancellation\nCustomer: well honestly it’s due to some you know issues with the staff last time it really wasn’t up to um standard\nAgent: Oh, I'm very sorry to hear that.\nAgent: i apologize for that experience aiden uh have you considered changing the date or perhaps a different room type instead\nCustomer: No, I don't want to stay there again.\nAgent: We have a new management team in place since your last visit.\nCustomer: It left a bad taste in my mouth.\nAgent: i see so you're looking at hilton just so you know we do have some cancellation policies that could work for you okay\nCustomer: I've already booked elsewhere.\nAgent: I understand. I will proceed with the cancellation.\nCustomer: Will there be a fee?\nAgent: Since it's more than 24 hours out, there is no fee.\nCustomer: Good. Please cancel it.\nAgent: Cancelled. We hope you'll give us another chance in the future.",
            },
            {
                id: "45842dfb-7545-409c-9a0a-c61b312b62ab",
                text: "Agent: Beachfront Suites, Emily speaking.\nCustomer: Hi, this is Nora Bailey.\nAgent: Hi Nora, how can I help?\nCustomer: I need to cancel booking bk 6572 841.\nAgent: right let me pull that up so our policy states that if you cancel you know within thirty days of your arrival you'll incur a cancellation fee of fifty percent uh of your total you know booking cost\nCustomer: Thirty days? That's a huge window.\nCustomer: well it seems a bit rigid can you um explain why it's like so strict\nAgent: sure we have to adhere to specific uh booking commitments and assure availability for other guests that’s um a common practice in the industry\nCustomer: Marriott doesn't do that.\nAgent: specialized resorts often have stricter policies than standard city hotels.\nCustomer: It's just a weekend trip.\nAgent: typically we do not waive fees unless there are extenuating circumstances like a medical issue or um emergency\nCustomer: My plans just changed.\nAgent: I see.\nAgent: you'll get charged that fifty percent fee right away cancelling um means you’ll be responsible for like that charge\nCustomer: Fine, just cancel it.\nAgent: Processing cancellation now.",
            },
            {
                id: "313b5693-b4ec-498f-81af-693fd7219f20",
                text: "Customer: hi um this is madison murphy i’m calling about cancellation fees particularly uh for last minute cancellations\nAgent: Hello Madison.\nAgent: i understand that you're asking specifically about uh our cancellation policy um for last minute cancellations right\nCustomer: Yes, I might need to cancel for tomorrow.\nCustomer: yeah i um noticed that it's like why should i be penalized for things out of my control\nAgent: sure umm for last minute cancellations it can be around uh fifty percent of the total charges whereas advance cancellations only have a um ten percent fee\nCustomer: That's a big jump.\nAgent: It is designed to discourage last-minute drops that we can't refill.\nCustomer: but what about my options if i wanted to change my booking or um push it further out you know\nAgent: You can move the date, but a change fee applies.\nCustomer: How much is that?\nAgent: $30.\nCustomer: That's better than 50% of the stay.\nAgent: Would you like to do that?\nCustomer: Yes, move it to next month.\nAgent: Done.",
            },
            {
                id: "d853949f-632b-42aa-b6af-7e79f974a670",
                text: "Agent: LuxStay Hotels.\nCustomer: yes uh the cancellation policy for my booking\nAgent: Booking ID?\nCustomer: bk 8942 218.\nAgent: Thanks Sebastian.\nAgent: well i just want to know um uh about the fees if i decide to cancel i’m like a bit frustrated with them\nCustomer: yes but isn’t there a way to like avoid these fees\nAgent: Only if you booked the refundable rate.\nAgent: like cancel without fees at all\nCustomer: I think I did.\nAgent: Let me check... No, this is the Advance Purchase rate. It's non-refundable usually, but allows cancellation for a fee.\nCustomer: Ugh.\nCustomer: no i just i just want to cancel and be done with it\nAgent: Okay. The fee will be applied to your card.\nCustomer: Fine.\nAgent: Cancelled.",
            },
        ],
        time: 211.42157173156738,
    },
    evidence: [
        {
            transcript_id: "2b292d7f-1c0b-49c9-b27b-b7653bf2496c",
            turn_numbers: [1, 5, 23, 24, 25],
            relevant_turns: [
                {
                    turn_index: 1,
                    speaker: "Customer",
                    text: "hi this is david ross i wanted to understand the like cancellation fees and policies for my booking",
                },
                {
                    turn_index: 5,
                    speaker: "Customer",
                    text: "right i heard that can you explain how the fees work like for last minute cancellations",
                },
                {
                    turn_index: 23,
                    speaker: "Customer",
                    text: "you know that seems really frustrating why is it it so high",
                },
                {
                    turn_index: 24,
                    speaker: "Agent",
                    text: "it\u2019s based on um occupancy rates and other factors you know uhh that impact our ability to rebook those rooms quickly",
                },
                {
                    turn_index: 25,
                    speaker: "Customer",
                    text: "i guess that makes sense but it feels like all hotels are charging these high fees lately",
                },
            ],
        },
        {
            transcript_id: "1af24b45-1acd-4cfc-bd30-4fbc3e5f87ce",
            turn_numbers: [1, 4, 10, 16, 25],
            relevant_turns: [
                {
                    turn_index: 1,
                    speaker: "Customer",
                    text: "hi ava this is mason um cook i wanted to ask about your cancellation fees especially for last minute bookings",
                },
                {
                    turn_index: 4,
                    speaker: "Agent",
                    text: "got it so for last minute cancellations the fees are um significantly higher compared to advance cancellations it's i think about forty eight percent of the total booking amount",
                },
                {
                    turn_index: 10,
                    speaker: "Agent",
                    text: "okay let me just pull that up one moment please a ah yes i see your booking so your cancellation fee would apply since it was a last minute cancellation",
                },
                {
                    turn_index: 16,
                    speaker: "Agent",
                    text: "unfortunately mason there\u2019s just um no way to completely avoid the fees but the earlier you can inform us um the less you might have to pay",
                },
                {
                    turn_index: 25,
                    speaker: "Customer",
                    text: "can that still lead to low cancellation fees",
                },
            ],
        },
        {
            transcript_id: "e2c82bd8-f526-4785-bee5-f8a77e50adad",
            turn_numbers: [1, 2, 3, 8, 12],
            relevant_turns: [
                {
                    turn_index: 1,
                    speaker: "Customer",
                    text: "hi james uh this is noah noah gomez i\u2019m calling to uh cancel my um booking",
                },
                {
                    turn_index: 2,
                    speaker: "Agent",
                    text: "i'm sorry uh to hear that noah may i um know the reason for the cancellation",
                },
                {
                    turn_index: 3,
                    speaker: "Customer",
                    text: "yeah uh the location is just not convenient you know i found a better deal at hilton nearby uh",
                },
                {
                    turn_index: 8,
                    speaker: "Agent",
                    text: "i see definitely understandable let me explain our uh cancellation policy for you",
                },
                {
                    turn_index: 12,
                    speaker: "Agent",
                    text: "alright um it looks like there\u2019s a cancellation fee you know due to the timing which is actually um fifteen percent of like the total",
                },
            ],
        },
        {
            transcript_id: "17f3d46c-03b6-4e9c-a338-21049ccce994",
            turn_numbers: [6, 8, 12, 18, 20],
            relevant_turns: [
                {
                    turn_index: 6,
                    speaker: "Agent",
                    text: "ah okay so i can help with that last minute cancellations usually incur higher fees um due to operational constraints",
                },
                {
                    turn_index: 8,
                    speaker: "Agent",
                    text: "i understand this is frustrating generally last minute fees can be significantly higher uh often around like fifty percent more than advance cancellations actually sorry i meant i guess it's about fifty percent more",
                },
                {
                    turn_index: 12,
                    speaker: "Agent",
                    text: "i can see why you\u2019d think that it's um stressful but the fees are in place to help cover the costs incurred when rooms are held",
                },
                {
                    turn_index: 18,
                    speaker: "Agent",
                    text: "normally we require at least twenty four hours notice to waive these fees does that um help",
                },
                {
                    turn_index: 20,
                    speaker: "Agent",
                    text: "emergencies are accounted for but you will typically need to provide documentation it\u2019s all uh part of the policy checklist",
                },
            ],
        },
        {
            transcript_id: "be6e9fab-4afa-4103-9f4f-6e7e9b13d4d4",
            turn_numbers: [3, 7, 8, 9, 10],
            relevant_turns: [
                {
                    turn_index: 3,
                    speaker: "Customer",
                    text: "yeah uh i'm calling to inquire about cancellation policies for my booking uh in los angeles",
                },
                {
                    turn_index: 7,
                    speaker: "Customer",
                    text: "exactly uh i need to know if if i can reschedule to avoid cancellation fees",
                },
                {
                    turn_index: 8,
                    speaker: "Agent",
                    text: "right i can help with that our cancellation policy does allow for um rescheduling without fees under certain conditions",
                },
                {
                    turn_index: 9,
                    speaker: "Customer",
                    text: "oh really what conditions apply",
                },
                {
                    turn_index: 10,
                    speaker: "Agent",
                    text: "well if you um reschedule within twenty four hours of uh your original booking date there's no fee otherwise a cancellation fee could apply uh typically",
                },
            ],
        },
        {
            transcript_id: "5c329603-79f2-47dd-ac4d-2397af3fb314",
            turn_numbers: [4, 5, 6, 8, 18],
            relevant_turns: [
                {
                    turn_index: 4,
                    speaker: "Agent",
                    text: "thank you ethan and um can i ask the reason for your cancellation",
                },
                {
                    turn_index: 5,
                    speaker: "Customer",
                    text: "uh yeah i\u2019m just not happy um with the cancellation policy you guys have",
                },
                {
                    turn_index: 6,
                    speaker: "Agent",
                    text: "i understand actually the cancellation terms they can uh sometimes be confusing would you like me to clarify them for you",
                },
                {
                    turn_index: 8,
                    speaker: "Agent",
                    text: "okay our policy uh it typically allows for cancellations up to twenty four hours before um check in for a full refund but i mean i know it can feel limiting especially if plans change um suddenly",
                },
                {
                    turn_index: 18,
                    speaker: "Agent",
                    text: "thank you so just to summarize you're cancelling due to dissatisfaction with our cancellation policy right",
                },
            ],
        },
        {
            transcript_id: "7a820f19-88da-43d1-948e-bc0fe0433251",
            turn_numbers: [1, 4, 5, 8, 10],
            relevant_turns: [
                {
                    turn_index: 1,
                    speaker: "Customer",
                    text: "hi this is aiden hernandez um i’m calling to uh cancel my booking option",
                },
                {
                    turn_index: 4,
                    speaker: "Agent",
                    text: "thank you aiden um just so you know can i ask what prompted this cancellation",
                },
                {
                    turn_index: 5,
                    speaker: "Customer",
                    text: "well honestly it’s due to some you know issues with the staff last time it really wasn’t up to um standard",
                },
                {
                    turn_index: 8,
                    speaker: "Agent",
                    text: "i apologize for that experience aiden uh have you considered changing the date or perhaps a different room type instead",
                },
                {
                    turn_index: 10,
                    speaker: "Agent",
                    text: "i see so you're looking at hilton just so you know we do have some cancellation policies that could work for you okay",
                },
            ],
        },
        {
            transcript_id: "45842dfb-7545-409c-9a0a-c61b312b62ab",
            turn_numbers: [4, 7, 8, 12, 16],
            relevant_turns: [
                {
                    turn_index: 4,
                    speaker: "Agent",
                    text: "right let me pull that up so our policy states that if you cancel you know within thirty days of your arrival you'll incur a cancellation fee of fifty percent uh of your total you know booking cost",
                },
                {
                    turn_index: 7,
                    speaker: "Customer",
                    text: "well it seems a bit rigid can you um explain why it's like so strict",
                },
                {
                    turn_index: 8,
                    speaker: "Agent",
                    text: "sure we have to adhere to specific uh booking commitments and assure availability for other guests that\u2019s um a common practice in the industry",
                },
                {
                    turn_index: 12,
                    speaker: "Agent",
                    text: "typically we do not waive fees unless there are extenuating circumstances like a medical issue or um emergency",
                },
                {
                    turn_index: 16,
                    speaker: "Agent",
                    text: "you'll get charged that fifty percent fee right away cancelling um means you\u2019ll be responsible for like that charge",
                },
            ],
        },
        {
            transcript_id: "313b5693-b4ec-498f-81af-693fd7219f20",
            turn_numbers: [1, 4, 7, 10, 21],
            relevant_turns: [
                {
                    turn_index: 1,
                    speaker: "Customer",
                    text: "hi um this is madison murphy i’m calling about cancellation fees particularly uh for last minute cancellations",
                },
                {
                    turn_index: 4,
                    speaker: "Agent",
                    text: "i understand that you're asking specifically about uh our cancellation policy um for last minute cancellations right",
                },
                {
                    turn_index: 7,
                    speaker: "Customer",
                    text: "yeah i um noticed that it's like why should i be penalized for things out of my control",
                },
                {
                    turn_index: 10,
                    speaker: "Agent",
                    text: "sure umm for last minute cancellations it can be around uh fifty percent of the total charges whereas advance cancellations only have a um ten percent fee",
                },
                {
                    turn_index: 21,
                    speaker: "Customer",
                    text: "but what about my options if i wanted to change my booking or um push it further out you know",
                },
            ],
        },
        {
            transcript_id: "d853949f-632b-42aa-b6af-7e79f974a670",
            turn_numbers: [3, 8, 10, 13, 28],
            relevant_turns: [
                {
                    turn_index: 3,
                    speaker: "Customer",
                    text: "yes uh the cancellation policy for my booking",
                },
                {
                    turn_index: 8,
                    speaker: "Agent",
                    text: "well i just want to know um uh about the fees if i decide to cancel i\u2019m like a bit frustrated with them",
                },
                {
                    turn_index: 10,
                    speaker: "Customer",
                    text: "yes but isn\u2019t there a way to like avoid these fees",
                },
                {
                    turn_index: 13,
                    speaker: "Agent",
                    text: "like cancel without fees at all",
                },
                {
                    turn_index: 28,
                    speaker: "Customer",
                    text: "no i just i just want to cancel and be done with it",
                },
            ],
        },
    ],
};

// --- 3. SUB-COMPONENT: EVIDENCE SIDEBAR ---
const EvidenceSidebar = ({ isOpen, onClose, data }: { isOpen: boolean; onClose: () => void; data: AnalysisResponse | null }) => {
    // State to track which conversations are expanded
    const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

    if (!data) return null;

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && <div className="fixed inset-0 bg-black/20 z-40 transition-opacity" onClick={onClose} />}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Evidence Detail</h2>
                            <p className="text-xs text-gray-500 mt-1">Found {data.evidence.length} relevant transcripts</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#f8f9fa]">
                        {data.evidence.map((ev, i) => {
                            const fullTextObj = data.bot_answer.leave_text.find((t) => t.id === ev.transcript_id);
                            const isExpanded = !!expandedIds[ev.transcript_id];

                            // Refactored: Removed useMemo from inside the loop.
                            // Parsing logic is lightweight enough to run on render, or could be extracted to a helper function.
                            let fullConversation: RelevantTurn[] = [];

                            if (fullTextObj) {
                                fullConversation = fullTextObj.text.split("\n").map((line, idx) => {
                                    const colonIndex = line.indexOf(":");
                                    let speaker = "System";
                                    let text = line;
                                    if (colonIndex !== -1) {
                                        speaker = line.substring(0, colonIndex).trim();
                                        text = line.substring(colonIndex + 1).trim();
                                    }
                                    return { turn_index: idx, speaker, text };
                                });
                            }

                            // Determine which set of turns to show: Relevant only or Full
                            const displayedTurns = isExpanded && fullConversation.length > 0 ? fullConversation : ev.relevant_turns;

                            return (
                                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    {/* Card Header */}
                                    <div className="bg-[#f0f4f9] px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FileText size={14} className="text-blue-600" />
                                            <span className="text-xs font-semibold text-gray-700 font-mono">ID: {ev.transcript_id.slice(0, 8)}...</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-gray-500 border border-gray-200">
                                                {isExpanded ? "All Turns" : `${ev.relevant_turns.length} Relevant Turns`}
                                            </span>
                                            {fullTextObj && (
                                                <button
                                                    onClick={() => toggleExpand(ev.transcript_id)}
                                                    className="flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full hover:bg-blue-200 transition-colors"
                                                >
                                                    {isExpanded ? (
                                                        <>
                                                            Show Less <ChevronUp size={12} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            Show Full <ChevronDown size={12} />
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Body with Unified View */}
                                    <div className="p-4">
                                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                                            {displayedTurns.map((turn, tIdx) => (
                                                <div key={tIdx} className={`flex gap-3 ${turn.speaker === "Customer" ? "flex-row" : "flex-row-reverse"}`}>
                                                    <div
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                                            turn.speaker === "Customer" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                                                        }`}
                                                    >
                                                        {turn.speaker === "Customer" ? <User size={14} /> : <Bot size={14} />}
                                                    </div>
                                                    <div
                                                        className={`flex-1 p-3 rounded-lg text-sm leading-relaxed ${
                                                            turn.speaker === "Customer" ? "bg-gray-50 text-gray-800 rounded-tl-none" : "bg-blue-50 text-blue-900 rounded-tr-none"
                                                        }`}
                                                    >
                                                        <div className="text-[10px] uppercase font-bold tracking-wider opacity-50 mb-1">{turn.speaker}</div>
                                                        {turn.text}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default function Home() {
    const [inputText, setInputText] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // State for the Evidence Modal/Sidebar
    const [selectedEvidenceData, setSelectedEvidenceData] = useState<AnalysisResponse | null>(null);
    const [isEvidencePanelOpen, setIsEvidencePanelOpen] = useState(false);

    // Store hooks
    const { chats, activeChatId, addChat, setActiveChat, appendMessage, deleteChat } = useChatStore();

    const activeChat = chats.find((c) => c.id === activeChatId) || null;
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Handle responsive check
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setIsSidebarOpen(false);
            else setIsSidebarOpen(false);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeChat?.messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        let newChatId = activeChatId;

        if (!activeChat) {
            const newChat = addChat(inputText);
            newChatId = newChat.id;
        } else if (newChatId) {
            appendMessage(newChatId, {
                role: "user",
                text: inputText,
                createdAt: Date.now(),
            });
        }

        if (newChatId) {
            // SIMULATE API CALL: Injecting the structured JSON response
            setTimeout(() => {
                appendMessage(newChatId!, {
                    role: "assistant",
                    text: MOCK_LLM_RESPONSE.bot_answer.answer, // Fallback text for chat bubble
                    createdAt: Date.now(),
                    // We attach the full structured object to the message
                    // Note: You might need to update your useChatStore types to accept 'data' field
                    data: MOCK_LLM_RESPONSE,
                });
            }, 600); // Small fake delay
        }

        setInputText("");
    };

    const handleNewChat = () => {
        setActiveChat(null);
        setInputText("");
        if (isMobile) setIsSidebarOpen(false);
    };

    const openEvidence = (data: AnalysisResponse) => {
        setSelectedEvidenceData(data);
        setIsEvidencePanelOpen(true);
    };

    return (
        <div className="flex h-screen text-[#1f1f1f] font-sans overflow-hidden matrix bg-white">
            {/* --- SIDEBAR --- */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 transition-all matrix duration-300 ease-in-out flex flex-col bg-[#f0f4f9]
                    ${isSidebarOpen ? "w-[280px] translate-x-0" : "-translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:pointer-events-none"}
                `}
            >
                <div className="p-4 flex items-center justify-between">
                    <button onClick={handleNewChat} className="flex items-center gap-3 bg-white shadow-sm hover:shadow-md text-[#444746] px-4 py-3 rounded-xl transition-all w-full sm:w-auto">
                        <Plus size={20} />
                        <span className="text-sm font-medium">New chat</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-2">
                    <div className="text-xs font-medium text-gray-500 mb-3 px-2">Recent</div>
                    <div className="space-y-1">
                        {chats.map((chat) => (
                            <div
                                key={chat.id}
                                className={`group flex items-center justify-between p-2 rounded-full cursor-pointer text-sm text-[#444746] hover:bg-white transition-colors
                                ${activeChatId === chat.id ? "bg-[#d3e3fd] text-[#001d35] font-medium" : ""}
                                `}
                                onClick={() => {
                                    setActiveChat(chat.id);
                                    if (isMobile) setIsSidebarOpen(false);
                                }}
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <MessageSquare size={16} className="shrink-0" />
                                    <span className="truncate max-w-[160px]">{chat.title}</span>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteChat(chat.id);
                                    }}
                                    className={`opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity ${activeChatId === chat.id ? "opacity-100" : ""}`}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 mt-auto space-y-2">
                    <button className="flex items-center gap-3 w-full p-2 text-sm text-[#444746] hover:bg-white rounded-lg transition-colors">
                        <Settings size={18} />
                        {isSidebarOpen && <span>Settings</span>}
                    </button>
                </div>
            </aside>

            {/* --- OVERLAY for Mobile --- */}
            {isMobile && isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setIsSidebarOpen(false)} />}

            {/* --- MAIN CONTENT --- */}
            <main className={`flex-1 flex flex-col h-full transition-all duration-300 relative p-2 md:p-5 ${isSidebarOpen && !isMobile ? "ml-[280px]" : "ml-0"}`}>
                <div className="flex-1 flex flex-col h-full transition-all duration-300 relative rounded-2xl bg-white shadow-xl">
                    {/* HEADER */}
                    <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-20">
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                                <Menu size={24} />
                            </button>
                            <span className="text-xl font-medium text-gray-600 tracking-tight">Flyperplex</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm">F</div>
                        </div>
                    </header>

                    {/* CONTENT AREA */}
                    <div className="flex-1 overflow-y-auto w-full relative">
                        <div className="max-w-[900px] mx-auto w-full min-h-full flex flex-col">
                            {!activeChat ? (
                                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
                                    <div className="mb-8">
                                        <h1 className="text-5xl sm:text-6xl font-medium text-[#c4c7c5] tracking-tight mb-2">Hello, User</h1>
                                        <h1 className="text-5xl sm:text-6xl font-medium text-[#444746] tracking-tight">How can I help you today?</h1>
                                    </div>
                                    <p className="text-gray-400 mb-8">Try asking: why hotel bookings get cancel</p>
                                </div>
                            ) : (
                                <div className="flex-1 p-4 pb-32 pt-8 space-y-8">
                                    {activeChat.messages.map((m, idx) => (
                                        <div key={idx} className="w-full flex flex-col gap-2">
                                            {m.role === "user" ? (
                                                <div className="flex justify-end">
                                                    <div className="bg-[#f0f4f9] text-[#1f1f1f] max-w-[80%] px-4 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed">{m.text}</div>
                                                </div>
                                            ) : (
                                                /* ASSISTANT MESSAGE */
                                                <div className="flex gap-4 max-w-3xl w-full mx-auto md:ml-0 md:mr-auto">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 shrink-0 mt-1" />

                                                    <div className="flex-1 overflow-hidden">
                                                        {/* Metadata Header (if structured data exists) */}
                                                        {m.data && (
                                                            <div className="flex items-center gap-2 mb-2 text-xs text-green-700 bg-green-50 w-fit px-2 py-1 rounded-md border border-green-100">
                                                                <Clock size={12} />
                                                                <span>Processed in {(m.data as AnalysisResponse).bot_answer.time.toFixed(2)}s</span>
                                                            </div>
                                                        )}

                                                        {/* Main Content */}
                                                        <div className="prose prose-p:text-[#1f1f1f] prose-headings:text-[#1f1f1f] max-w-none text-sm leading-relaxed">
                                                            <ReactMarkdown>{m.text}</ReactMarkdown>
                                                        </div>

                                                        {/* EVIDENCE PREVIEW CARD */}
                                                        {m.data && (
                                                            <div className="mt-4">
                                                                <button
                                                                    onClick={() => openEvidence(m.data as AnalysisResponse)}
                                                                    className="group flex flex-col sm:flex-row sm:items-center justify-between w-full bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md hover:shadow-blue-50 transition-all rounded-xl p-3 text-left"
                                                                >
                                                                    <div className="flex items-start gap-3">
                                                                        <div className="bg-blue-50 text-blue-600 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                                                                            <FileText size={18} />
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="text-sm font-semibold text-gray-800">View Source Evidence</h4>
                                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                                {(m.data as AnalysisResponse).evidence.length} conversations analyzed for this answer.
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mt-2 sm:mt-0 self-end sm:self-center">
                                                                        <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500" />
                                                                    </div>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* INPUT AREA */}
                    <div className="p-4 w-full flex justify-center items-center flex-col gap-4">
                        <div className="max-w-[900px] mx-auto w-full relative">
                            <form
                                onSubmit={handleSubmit}
                                className={`bg-[#f0f4f9] rounded-[2rem] transition-all duration-200 border border-transparent focus-within:bg-white focus-within:shadow-lg focus-within:border-gray-200 relative
                                    ${activeChat ? "min-h-[60px]" : "min-h-[60px]"}
                                `}
                            >
                                <div className="flex items-center px-4 py-3 gap-3">
                                    <button type="button" className="p-2 bg-[#d3e3fd] hover:bg-[#c4d7fc] text-[#001d35] rounded-full transition-colors shrink-0">
                                        <Plus size={20} />
                                    </button>
                                    <textarea
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSubmit(e);
                                            }
                                        }}
                                        placeholder="Ask about hotel cancellations..."
                                        className="w-full bg-transparent border-none outline-none text-[#1f1f1f] placeholder:text-[#5e5e5e] text-base resize-none max-h-32 py-2"
                                        rows={1}
                                        style={{ minHeight: "24px" }}
                                    />
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            type="submit"
                                            className={`p-2 ${
                                                inputText.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-200"
                                            } rounded-full text-white transition-all animate-in zoom-in duration-200 relative`}
                                        >
                                            <Send className="size-5 -translate-x-px translate-y-px" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="text-center mt-3">
                            <p className="text-xs text-[#5e5e5e]">Flyperplex can make mistakes, so double-check it.</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* --- SLIDING EVIDENCE SIDEBAR --- */}
            <EvidenceSidebar isOpen={isEvidencePanelOpen} onClose={() => setIsEvidencePanelOpen(false)} data={selectedEvidenceData} />
        </div>
    );
}
