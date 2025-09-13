'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegisterMutation } from '@/gql/graphql';
import { useAuthStore } from '@/store/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z
    .string()
    .refine(
      (val) =>
        val.length >= 8 &&
        /[A-Z]/.test(val) &&
        /[a-z]/.test(val) &&
        /[0-9]/.test(val) &&
        /[^A-Za-z0-9]/.test(val),
      {
        message:
          'Password must be at least 8 characters long and include upper, lower, number, and special character',
      },
    ),
});

type FormData = z.infer<typeof schema>;

const RegisterPage = () => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [mutate, { error, loading }] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormData) => {
    const res = await mutate({ variables: { input: values } });
    if (!res.data) return;
    const { user, tokens } = res.data.register;
    setAuth(user, tokens.accessToken, tokens.refreshToken);
    router.push('/app');
  };
  return (
    <main className="container max-w-md py-20">
      <h1 className="text-2xl font-bold mb-6">Create account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" autoComplete="username" {...register('username')} />
          {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="password" {...register('password')} />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>
        <Button type="submit" disabled={loading}>
          Sign up
        </Button>
        {error && <p className="text-sm text-red-600 mt-2">{error.message}</p>}
      </form>
    </main>
  );
};

export default RegisterPage;
