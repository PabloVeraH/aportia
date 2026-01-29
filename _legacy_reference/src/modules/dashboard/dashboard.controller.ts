import { Controller, Get, Post, Body, Render, UseGuards, Req, Res } from '@nestjs/common';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { DashboardService } from './dashboard.service';
import type { Request, Response } from 'express';

@Controller('dashboard')
@UseGuards(SupabaseAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get()
  @Render('pages/dashboard')
  async index(@Req() req: any, @Res() res: Response) {
    const user = req.user;
    const data = await this.dashboardService.getUserCenters(user.id);

    // Use active center from cookie or default to first one
    let activeCenterId = req.cookies['x-active-center-id'];

    // If no active center cookie, or it's not valid for this user, default to first available
    const isValidCenter = data.centers.some((c: any) => c.id === activeCenterId);
    if (!activeCenterId || (!isValidCenter && data.centers.length > 0)) {
      if (data.centers.length > 0) {
        const defaultCenter = data.centers[0].id;
        res.cookie('x-active-center-id', defaultCenter, { httpOnly: true, sameSite: 'lax' });
        activeCenterId = defaultCenter;
      }
    }

    return {
      layout: 'layouts/main',
      title: 'Dashboard - HelpChain',
      ...data,
      activeCenterId
    };
  }

  @Post('switch-center')
  async switchCenter(@Body('center_id') centerId: string, @Req() req: any, @Res() res: Response) {
    // Validate user has access to this center
    const user = req.user;
    const data = await this.dashboardService.getUserCenters(user.id);

    const hasAccess = data.centers.some((c: any) => c.id === centerId);

    if (hasAccess) {
      res.cookie('x-active-center-id', centerId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });
    }

    return res.redirect('/dashboard');
  }
}
