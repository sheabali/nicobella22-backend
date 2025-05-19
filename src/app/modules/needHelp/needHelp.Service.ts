import { Contact } from "@prisma/client";
import { IJwtPayload } from "../../types/auth.type";
import prisma from "../../utils/prisma";

const createNeedHelp = async (payload: Contact) => {
  try {
    const newEntry = await prisma.contact.create({
      data: payload,
    });

    return {
      data: newEntry,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while submitting the help request.",
    };
  }
};

const getAllNeedHelp = async (authUser: IJwtPayload) => {
  if (authUser.role !== "ADMIN") {
    return {
      success: false,
      message: "You are not authorized to view this resource.",
    };
  }

  try {
    const entries = await prisma.contact.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      data: entries,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching help requests.",
    };
  }
};

const getSingleHelp = async (helpId: string) => {
  const entries = await prisma.contact.findUnique({
    where: {
      id: helpId,
    },
  });

  return {
    entries,
  };
};

export const NeedHelpService = {
  createNeedHelp,
  getAllNeedHelp,
  getSingleHelp,
};
