import { Controller, Get, Post, Body, Render, UseGuards, Req, Res } from '@nestjs/common';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { DonationsService } from './donations.service';
import type { Request, Response } from 'express';

@Controller('donations')
@UseGuards(SupabaseAuthGuard)
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) { }

  @Get()
  @Render('pages/donations/index')
  async index(@Req() req: any) {
    const activeCenterId = req.cookies['x-active-center-id'];
    const donations = await this.donationsService.findAll(activeCenterId);

    return {
      layout: 'layouts/main',
      title: 'Donaciones - HelpChain',
      donations
    };
  }

  @Get('new')
  @Render('pages/donations/form')
  async new(@Req() req: any) {
    // We already have activeCenterId from interceptor
    return {
      layout: 'layouts/main',
      title: 'Registrar Donación - HelpChain',
    };
  }

  @Post()
  async create(@Body() body: any, @Req() req: any, @Res() res: Response) {
    try {
      const user = req.user;
      // Ensure center_id matches active center cookie for security
      const activeCenterId = req.cookies['x-active-center-id'];
      if (body.center_id !== activeCenterId) {
        throw new Error('Center mismatch');
      }

      await this.donationsService.createDonation(body, user.id);

      // Flash message would go here
      return res.redirect('/dashboard');
    } catch (e) {
      return res.render('pages/donations/form', {
        layout: 'layouts/main',
        error: 'Error al guardar donación: ' + e.message,
        ...body
      });
    }
  }

  // API Endpoint for product search (called by Client JS)
  @Get('api/products')
  async searchProducts(@Req() req: Request) { // Not using @Query to avoid importing it yet
    const query = req.query['q'] as string;
    if (!query || query.length < 3) return [];
    return this.donationsService.searchProducts(query);
  }
}
