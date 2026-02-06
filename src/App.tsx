import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Orientacoes from "./pages/Orientacoes";
import Questionario from "./pages/Questionario";
import Loading from "./pages/Loading";
import Resultado from "./pages/Resultado";
import CriarConta from "./pages/CriarConta";
import Login from "./pages/Login";
import DadosComplementares from "./pages/DadosComplementares";
import Compra from "./pages/Compra";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import RedefinirSenha from "./pages/RedefinirSenha";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/orientacoes" element={<Orientacoes />} />
          <Route path="/questionario/:bloco" element={<Questionario />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/resultado" element={<Resultado />} />
          <Route path="/criar-conta" element={<CriarConta />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dados-complementares" element={<DadosComplementares />} />
          <Route path="/compra" element={<Compra />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
