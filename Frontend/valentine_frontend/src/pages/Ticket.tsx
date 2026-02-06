import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Download, Share2, Home } from "lucide-react";
import ValentineFog from "@/components/ticket/ValentineFog";
import ValentineTicket from "@/components/ticket/ValentineTicket";
import html2canvas from "html2canvas";

interface TicketData {
  name: string;
  gender: string;
  dob: string;
  mobile: string;
  email: string;
  ticketId: string;
}

const Ticket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef<HTMLDivElement>(null);
  const ticketData = location.state as TicketData;

  // Redirect to home if no ticket data
  useEffect(() => {
    if (!ticketData) {
      console.warn("No ticket data found, redirecting to home");
      setTimeout(() => navigate("/"), 2000);
    }
  }, [ticketData, navigate]);

  const handleDownload = async () => {
    if (!ticketRef.current) return;

    try {
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: '#0f0305',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `valentine-ticket-${ticketData?.ticketId || 'download'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to download ticket:', error);
    }
  };

  const handleShare = async () => {
    if (!ticketRef.current) return;

    try {
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: '#0f0305',
        scale: 2,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], `valentine-ticket-${ticketData?.ticketId}.png`, {
          type: 'image/png'
        });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'My Valentine Ball Ticket',
            text: 'Check out my ticket for the Valentine Ball Party! 💕',
            files: [file],
          });
        } else {
          // Fallback: Download if share not supported
          handleDownload();
        }
      });
    } catch (error) {
      console.error('Failed to share ticket:', error);
    }
  };

  // Show loading state while redirecting
  if (!ticketData) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0f0305]">
        <div className="text-center space-y-4">
          <div className="text-pink-400 text-lg">No ticket data found...</div>
          <div className="text-rose-300 text-sm">Redirecting to home page</div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <ValentineFog>
        <div className="space-y-8">
          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="text-6xl"
            >
              🎉
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-rose-100">
              Registration Successful!
            </h1>
            <p className="text-rose-300 text-lg">
              Welcome, <span className="text-pink-400 font-semibold">{ticketData.name}</span>! 💕
            </p>
            <p className="text-rose-400 text-sm max-w-md mx-auto">
              Your ticket has been generated. Save it and present it at the event entrance!
            </p>
          </motion.div>

          {/* Ticket Display */}
          <motion.div
            ref={ticketRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <ValentineTicket
              studentName={ticketData.name}
              ticketId={ticketData.ticketId}
            />
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 pb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Ticket
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share Ticket
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-rose-950/60 border border-pink-700/50 text-rose-200 font-semibold rounded-xl hover:bg-rose-900/60 transition-colors flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </motion.button>
          </motion.div>
        </div>
      </ValentineFog>
    </main>
  );
};

export default Ticket;
