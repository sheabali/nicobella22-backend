import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../../types/auth.type";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingServices } from "./booking.service";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingServices.bookingService({
    ...req.body,
  });

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Booking created succesfully",
    success: true,
    data: result,
  });
});
const getAllBooking = catchAsync(async (req: Request, res: Response) => {
  // Pass query parameters and authenticated user to the service
  const result = await BookingServices.getAllBooking(
    req.query,
    req.user as IJwtPayload
  );
  console.log("result", result);
  sendResponse(res, {
    statusCode: StatusCodes.OK, // Use 200 for retrieval
    message: "Bookings retrieved successfully",
    success: true,
    data: result.bookings, // The bookings array
  });
});

export const BookingController = {
  createBooking,
  getAllBooking,
};

// const getSingleMeal = async (
//   menuId: string,
//   query: Record<string, unknown>,
//   authUser: IJwtPayload
// ) => {
//   const user = await User.findOne({
//     _id: authUser.userId,
//     role: UserRole.MEAL_PROVIDER,
//   });
//   if (!user) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'Invalid meal provider');
//   }
//   const meal = await Meal.findById(menuId);
//   if (!meal) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'Meal not found');
//   }
//   const result = await Meal.findById(menuId);
//   return result;
// };

// const createMeal = async (
//   mealData: Partial<IMeal>,
//   mealImages: IImageFiles,
//   user: IJwtPayload
// ) => {
//   const provider = await User.findOne({
//     _id: user.userId,
//     role: UserRole.MEAL_PROVIDER,
//   });

//   if (!provider) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'Invalid meal provider');
//   }
//   const { images } = mealImages;

//   if (!images || images.length === 0) {
//     throw new AppError(StatusCodes.BAD_REQUEST, 'Meal images are required.');
//   }

//   mealData.image = images.map((image) => image.path);

//   const newProduct = new Meal({
//     ...mealData,
//     mealProviderId: provider?.id,
//   });

//   const result = await newProduct.save();
//   return result;
// };
// const updateMeal = async (
//   productId: string,
//   payload: Partial<IMeal>,
//   mealImages: IImageFiles,
//   user: IJwtPayload
// ) => {
//   const meal = await Meal.findById(productId);
//   if (!meal) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'Meal not found');
//   }

//   const provider = await User.findOne({
//     _id: user.userId,
//     role: UserRole.MEAL_PROVIDER,
//   });

//   if (!provider) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'Invalid meal provider');
//   }
//   const { images } = mealImages;

//   if (!images || images.length === 0) {
//     throw new AppError(StatusCodes.BAD_REQUEST, 'Meal images are required.');
//   }

//   payload.image = images.map((image) => image.path);

//   return await Meal.findByIdAndUpdate(productId, payload, { new: true });
// };

// const deleteMeal = async (user: Partial<IUser>, id: string) => {
//   const provider = await User.findOne({
//     _id: user?.userId,
//     role: UserRole.MEAL_PROVIDER,
//   });

//   if (!provider) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'Invalid meal provider');
//   }
//   const doesProviderOwnTheMeal = await Meal.findOne({
//     _id: id,
//     mealProviderId: user?.userId,
//   });

//   if (!doesProviderOwnTheMeal) {
//     throw new AppError(StatusCodes.FORBIDDEN, "You don't own this meal");
//   }
//   // Find the existing meal first
//   const existingMeal = await Meal.findById(id);

//   if (!existingMeal) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'Meal not found');
//   }
//   const result = await Meal.findByIdAndUpdate(
//     id,
//     { isDeleted: true },
//     { new: true }
//   );
//   return result;
// };
