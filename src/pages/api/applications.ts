// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createApplication } from "../../../util/client";
import { validatePlanningParams } from "../../../util/validator";

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Insert new planning application
 *     description: Inserts a new planning application
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             reference: string
 *             description: string
 *             address: string
 *             applicationType: string
 *             applicationStage: string
 *             height: string
 *             developmentType: string
 *             commentDeadline: string
 *             openSpaceGardens: string
 *             affordableHousing: string
 *             c02Emissions: string
 *             airQuality: string
 *           example:
 *             reference: 00/12345/ABC
 *             description: Lorem ipsum dolor sit amet, consectetur adipiscing elit 
 *             address: 123 Example Street Name Town Name City 
 *             applicationType: Full Planning Permission
 *             applicationStage: PCO
 *             height: 14
 *             developmentType: Change of Use
 *             commentDeadline: 31/12/2023 12:00:00 am
 *             openSpaceGardens: Yes
 *     responses:
 *       200:
 *         message: Success
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({
      error: { message: `Method ${method} Not Allowed` },
    });
    return;
  }

  const errors = await validatePlanningParams(req.body);
  if (errors.length > 0) {
    return res.status(400).json({
      error: { message: errors.join(", ") },
    });
  }

  const { 
    reference, 
    description, 
    address, 
    applicationType,
    applicationStage,
    height,
    developmentType,
    commentDeadline,
    openSpaceGardens,
  } = req.body;

  const data = {
    reference,
    description,
    address,
    applicationType,
    applicationStage,
    height,
    developmentType,
    commentDeadline,
    openSpaceGardens,
    isActive: true,
    _type: "planning-application",
  };

  try {
    await createApplication(data);
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({
      error: { message: "An error occurred while creating the application" },
    });
  }
}
