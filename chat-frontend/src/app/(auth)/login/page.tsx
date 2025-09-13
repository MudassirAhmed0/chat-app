'use client';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLoginMutation } from '@/gql/graphql';
import Link from 'next/link';

const schema = z.object({
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
const LoginPage = () => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const [mutate, { loading, error }] = useLoginMutation();

  const onSubmit = async (values: FormData) => {
    const res = await mutate({ variables: { input: values } });
    if (!res.data) return;
    const { user, tokens } = res.data.login;
    setAuth(user, tokens.accessToken, tokens.refreshToken);
    router.push('/');
  };

  return (
    <main className="  py-20 min-h-screen flex items-center justify-center flex-col">
      <div className="w-md">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...register('email')} />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="password"
              {...register('password')}
            />
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>
          <Button type="submit" disabled={loading}>
            Sign in
          </Button>
          {error && <p className="text-sm text-red-600 mt-2">{error.message}</p>}
        </form>
        <div className="mt-3">
          Need an account?{' '}
          <Link href={'/register'} className="text-[var(--primary)] underline">
            Sign up here
          </Link>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
