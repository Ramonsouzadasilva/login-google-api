import { z } from 'zod';

export const googleLoginSchema = z.object({
  idToken: z.string().nonempty('ID token is required'),
});
