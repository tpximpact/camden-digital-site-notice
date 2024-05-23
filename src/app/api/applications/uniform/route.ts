import {
  checkExistingReference,
  updateApplication,
  createApplication,
} from "@/app/actions/sanityClient";
import { validateUniformData } from "@/app/actions/uniformValidator";
import { verifyApiKey } from "@/app/lib/apiKey";
import { NextRequest, NextResponse } from "next/server";

interface ApplicationError {
  application: any;
  error: string;
}

interface ApplicationResult {
  success: string[];
  errors: ApplicationError[];
}

/**
 * @swagger
 * /api/applications:
 *   put:
 *     summary: Update multiple planning applications or create new ones if they don't exist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 applicationNumber:
 *                   type: string
 *                 description:
 *                   type: string
 *             example:
 *               - _id: abc123
 *                 applicationNumber: 0850/1235/C
 *                 description: Lorem ipsum dolor sit amet, consectetur adipiscing elit
 *                 address: 123 Example Street Name Town Name City
 *                 applicationType: Full Planning Permission
 *                 height: 14
 *                 developmentType: Change of Use
 *                 consultationDeadline: 31/12/2023 12:00:00 am
 *                 openSpaceGardens: true
 *               - _id: def456
 *                 applicationNumber: 0034/6789/F
 *                 description: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
 *                 address: 123 Example Street Name Town Name City
 *                 applicationType: Full Planning Permission
 *                 height: 14
 *                 developmentType: Change of Use
 *                 consultationDeadline: 31/12/2023 12:00:00 am
 *                 openSpaceGardens: true
 *     responses:
 *       200:
 *         description: Returns updated planning applications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 details:
 *                   type: any
 *       400:
 *         description: Invalid request body or missing required fields
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: An error occurred while updating the applications
 */

export async function PUT(req: NextRequest) {
  // Verify API key
  const referer = req.headers.get("x-api-key");
  const apiKey = referer as string;
  const isValidApiKey = verifyApiKey(apiKey);
  if (!isValidApiKey) {
    return new NextResponse("Invalid API key", { status: 401 });
  }

  const body = await req.json();
  console.log("Request Body:", body);
  if (!Array.isArray(body)) {
    return new NextResponse("Invalid request body. Expected an array.", {
      status: 400,
    });
  }

  const results: ApplicationResult = { success: [], errors: [] };

  for (const application of body) {
    const validationErrors = await validateUniformData(application);
    if (validationErrors.errors.length > 0) {
      results.errors.push({
        application,
        error: validationErrors.errors[0].message,
      });
      continue;
    }

    if (!application || typeof application !== "object") {
      results.errors.push({
        application,
        error: "Invalid application data",
      });
      continue;
    }

    const applicationData = {
      applicationNumber: application["DCAPPL[REFVAL]"],
      description: application["DCAPPL[BLPU_CLASS_DESC]"],
      applicationType: application["DCAPPL[Application Type_D]"],
      isActive: true,
      _type: "planning-application",
    };

    const { applicationNumber, ...updateData } = applicationData;

    if (!applicationNumber) {
      results.errors.push({
        application,
        error: "Missing required field: applicationNumber",
      });
      continue;
    }

    try {
      const existingApplication =
        await checkExistingReference(applicationNumber);
      if (existingApplication && existingApplication._id) {
        // Application found, check if update is needed
        if (checkAllowedUpdateFields(existingApplication, updateData)) {
          // Update the application
          await updateApplication(existingApplication._id, updateData);
          results.success.push(`Application ${applicationNumber} updated`);
        } else {
          results.success.push(
            `Application ${applicationNumber} no update needed`,
          );
        }
      } else {
        // Application not found, create a new one
        const newApplication = {
          applicationNumber,
          ...updateData,
        };
        await createApplication(newApplication);
        results.success.push(`Application ${applicationNumber} created`);
      }
    } catch (error) {
      console.error("Error updating application:", error);
      results.errors.push({
        application,
        error: "An error occurred while updating the application",
      });
    }
  }

  // Handle different response scenarios
  if (results.success.length === 0 && results.errors.length === 0) {
    return new NextResponse("No applications provided", { status: 400 });
  } else if (results.success.length === 0 && results.errors.length > 0) {
    return new NextResponse(
      JSON.stringify({ data: { errors: results.errors } }),
      {
        status: 400,
      },
    );
  } else if (results.errors.length > 0) {
    return new NextResponse(JSON.stringify({ data: results }), { status: 207 });
  } else {
    return NextResponse.json({ data: { success: results.success } });
  }
}

function checkAllowedUpdateFields(
  application: { [key: string]: any },
  data: { [key: string]: any },
) {
  return (
    application.applicationType !== data.applicationType ||
    application.description !== data.description
  );
}
