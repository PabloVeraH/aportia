import { Controller, Get, Post, Body, Param, Render, UseGuards, Req, Res } from '@nestjs/common';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { ProductsService } from './products.service';
import type { Response } from 'express';

@Controller('products')
@UseGuards(SupabaseAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  @Render('pages/products/index')
  async index(@Req() req: any) {
    // Ideally validation global role = system_admin or similar here
    const accessToken = req.cookies['sb-access-token'];
    const products = await this.productsService.findAll(accessToken);
    return {
      layout: 'layouts/main',
      title: 'Gestión de Productos - HelpChain',
      products
    };
  }

  @Get('new')
  @Render('pages/products/form')
  async new() {
    return {
      layout: 'layouts/main',
      title: 'Nuevo Producto',
      isNew: true
    }
  }

  @Post()
  async create(@Body() body: any, @Req() req: any, @Res() res: Response) {
    try {
      const accessToken = req.cookies['sb-access-token'];
      await this.productsService.create(body, req.user.id, accessToken);
      return res.redirect('/products');
    } catch (e) {
      return res.render('pages/products/form', {
        layout: 'layouts/main',
        error: 'Error al crear producto: ' + e.message,
        ...body
      });
    }
  }

  @Get(':id/edit')
  @Render('pages/products/form')
  async edit(@Param('id') id: string, @Req() req: any) {
    const accessToken = req.cookies['sb-access-token'];
    const product = await this.productsService.findOne(id, accessToken);
    return {
      layout: 'layouts/main',
      title: 'Editar Producto',
      product,
      isNew: false
    }
  }

  @Post(':id')
  async update(@Param('id') id: string, @Body() body: any, @Req() req: any, @Res() res: Response) {
    try {
      const accessToken = req.cookies['sb-access-token'];
      await this.productsService.update(id, body, req.user.id, accessToken);
      return res.redirect('/products');
    } catch (e) {
      return res.render('pages/products/form', {
        layout: 'layouts/main',
        error: 'Error al actualizar: ' + e.message,
        product: { ...body, id }, // Keep ID
        isNew: false
      });
    }
  }

  @Post(':id/delete')
  async remove(@Param('id') id: string, @Req() req: any, @Res() res: Response) {
    try {
      const accessToken = req.cookies['sb-access-token'];
      await this.productsService.remove(id, req.user.id, accessToken);
      return res.redirect('/products');
    } catch (e) {
      // Should redirect with flash message realistically
      return res.redirect('/products');
    }
  }
}
