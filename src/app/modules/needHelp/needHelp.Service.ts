import { Contact } from "@prisma/client";
import QueryBuilder from "../../builder/QueryBuilder";
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

const getAllNeedHelp = async (query: unknown, authUser: IJwtPayload) => {
  try {
    const queryBuilder = new QueryBuilder(
      prisma.contact,
      query as Record<string, unknown>
    );

    const services = await queryBuilder
      .search(["serviceName"])
      .filter()
      // .include({ mechanic: true })
      .sort()
      .paginate()
      .execute();

    const meta = await queryBuilder.countTotal();

    return {
      success: true,
      data: services,
      meta,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching services.",
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
