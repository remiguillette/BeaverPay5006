import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { paymentFormSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Put application routes here
  // Prefix all routes with /api

  // Payment processing endpoint
  app.post('/api/payments/process', async (req, res) => {
    try {
      // Validate payment form data
      const validatedData = paymentFormSchema.parse(req.body);
      
      // In a real implementation, this would integrate with a payment processor
      // Here we'll simulate a successful payment

      // Create an order
      const order = await storage.createOrder({
        userId: null, // Anonymous order
        subtotal: 89.99,
        tax: 4.50,
        total: 94.49,
        status: "completed",
      });

      // Create order item
      await storage.createOrderItem({
        orderId: order.id,
        productName: "Produit exemple",
        quantity: 1,
        price: 89.99,
      });

      // Create payment record
      const payment = await storage.createPayment({
        orderId: order.id,
        amount: 94.49,
        currency: "CAD",
        paymentMethod: validatedData.paymentMethod,
        status: "completed",
        transactionId: `TR-${Math.floor(100000 + Math.random() * 900000)}`,
      });

      // Return payment information
      res.status(200).json({
        success: true,
        message: "Paiement traité avec succès",
        payment: {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
        },
        order: {
          id: order.id,
          total: order.total,
          status: order.status,
        }
      });
    } catch (error) {
      console.error("Payment processing error:", error);
      
      // Handle validation errors
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Données de paiement invalides",
          errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
      }
      
      // Handle other errors
      return res.status(500).json({
        success: false,
        message: "Erreur lors du traitement du paiement"
      });
    }
  });

  // Get payment status endpoint
  app.get('/api/payments/:id', async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id, 10);
      
      if (isNaN(paymentId)) {
        return res.status(400).json({
          success: false,
          message: "ID de paiement invalide"
        });
      }
      
      const payment = await storage.getPayment(paymentId);
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Paiement non trouvé"
        });
      }
      
      res.status(200).json({
        success: true,
        payment
      });
    } catch (error) {
      console.error("Error getting payment:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération du paiement"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
