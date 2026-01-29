import { Controller, Post, Body, Res, Get, Render, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Get('login')
  @Render('pages/login')
  loginPage(@Req() req: Request) {
    // If already logged in, redirect
    if (req.cookies['sb-access-token']) {
      return { redirect: '/dashboard' }; // Logic to handle this in client or middleware?
      // Actually best handled by a GuestGuard, but for now let's just render.
    }
    return { layout: 'layouts/auth', title: 'Login - HelpChain' };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const { data, error } = await this.authService.signIn(loginDto.email, loginDto.password);

      if (error || !data.session) {
        return res.render('pages/login', {
          layout: 'layouts/auth',
          error: 'Credenciales inválidas. Por favor intente nuevamente.',
          email: loginDto.email
        });
      }

      // Set cookies
      res.cookie('sb-access-token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: data.session.expires_in * 1000,
      });

      res.cookie('sb-refresh-token', data.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      // Redirect to dashboard
      return res.redirect('/dashboard');
    } catch (e) {
      return res.render('pages/login', {
        layout: 'layouts/auth',
        error: 'Error al iniciar sesión. Intente más tarde.',
        email: loginDto.email
      });
    }
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('sb-access-token');
    res.clearCookie('sb-refresh-token');
    res.clearCookie('x-active-center-id');
    return res.redirect('/auth/login');
  }
}
