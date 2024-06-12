import { Request, Response } from "express";
import User, { UserType } from "../models/user.model";

interface UserTypeStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

async function deleteUser(req: Request, res: Response): Promise<void> {
  const userId: string = req.params.userId;
  try {
    const deletedUser: UserType | null = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new Error("User not found");
    }
    res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function updateUser(req: Request, res: Response): Promise<void> {
  const userId: string = req.params.userId;
  const updatedData: Partial<UserType> = req.body;
  try {
    const updatedUser: UserType | null = await User.findByIdAndUpdate(
      userId,
      updatedData,
      {
        new: true,
      }
    );
    if (!updatedUser) {
      throw new Error("User not found");
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function getUserByAdmin(req: Request, res: Response): Promise<void> {
  const userId: string = req.params.userId;
  try {
    const user: UserType | null = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    res.status(200).json({ user });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}

async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const users: UserType[] = await User.find();
    res.status(200).json({ users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function getUserStats(req: Request, res: Response): Promise<void> {
  try {
    const totalUsers: number = await User.countDocuments();
    const activeUsers: number = await User.countDocuments({ isActive: true });
    const inactiveUsers: number = totalUsers - activeUsers;
    const userStats: UserTypeStats = { totalUsers, activeUsers, inactiveUsers };
    res.status(200).json({ userStats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function getUser(req: Request, res: Response): Promise<void> {
  try {
    const userId: string = req.params.userId;
    const userData: UserType | null = await User.findById(userId);
    if (!userData) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export {
  deleteUser,
  updateUser,
  getUser,
  getAllUsers,
  getUserStats,
  getUserByAdmin,
};
