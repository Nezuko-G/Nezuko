import { z } from "zod";
import type { User } from "@/types/dto/user.dto";
import { UserDTO } from "@/types/dto/user.dto";

type UserDTOType = z.infer<typeof UserDTO>;

export function mapUserFromDTO(dto: UserDTOType): User {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    role: dto.role,
    avatarUrl: dto.avatarUrl,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}

export function mapUsersFromDTO(dtoss: UserDTOType[]): User[] {
  return dtoss.map(mapUserFromDTO);
}

export function mapUserToDTO(user: User): UserDTOType {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}