'use client';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function CommentItem({ name, message }: { name: string; message: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }}>
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm font-medium">{name}</div>
          <p className="text-sm text-neutral-400">{message}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
