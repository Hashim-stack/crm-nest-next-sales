import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';
// Used to restrict API access based on roles
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
export const Public = () => SetMetadata('isPublic', true);
// Gets the logged-in user from request
export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user,
);
