"use client";

import { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { ContactAdminService } from "@/modules/contact/services/contact-admin.service";
import { LeadAdminService } from "@/modules/leads/services/lead-admin.service";

interface GrowthMetric {
  count: number;
  percentage: number;
  isPositive: boolean;
}

function calculateGrowth(items: { createdAt?: string }[], fallbackCount: number, fallbackPercentage: number, fallbackIsPositive: boolean): GrowthMetric {
  if (items.length === 0) {
    return { count: fallbackCount, percentage: fallbackPercentage, isPositive: fallbackIsPositive };
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11

  let currentMonthCount = 0;
  let previousMonthCount = 0;

  // Previous month dates
  let prevYear = currentYear;
  let prevMonth = currentMonth - 1;
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear -= 1;
  }

  items.forEach((item) => {
    if (!item.createdAt) return;
    const date = new Date(item.createdAt);
    if (isNaN(date.getTime())) return;

    const itemYear = date.getFullYear();
    const itemMonth = date.getMonth();

    if (itemYear === currentYear && itemMonth === currentMonth) {
      currentMonthCount++;
    } else if (itemYear === prevYear && itemMonth === prevMonth) {
      previousMonthCount++;
    }
  });

  let percentage = 0;
  if (previousMonthCount === 0) {
    percentage = currentMonthCount > 0 ? 100 : 0;
  } else {
    percentage = Math.round(((currentMonthCount - previousMonthCount) / previousMonthCount) * 100 * 100) / 100;
  }

  return {
    count: items.length,
    percentage: Math.abs(percentage),
    isPositive: percentage >= 0,
  };
}

export const EcommerceMetrics = () => {
  const [metrics, setMetrics] = useState({
    contact: { count: 3782, percentage: 11.01, isPositive: true },
    lead: { count: 5359, percentage: 9.05, isPositive: false }
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [contacts, leads] = await Promise.all([
          ContactAdminService.findAll(),
          LeadAdminService.findAll(),
        ]);

        const contactResult = calculateGrowth(contacts, 3782, 11.01, true);
        const leadResult = calculateGrowth(leads, 5359, 9.05, false);

        setMetrics({
          contact: contactResult,
          lead: leadResult
        });
      } catch (err) {
        console.error("Failed to fetch dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Liên Hệ
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : metrics.contact.count.toLocaleString()}
            </h4>
          </div>
          <Badge color={metrics.contact.isPositive ? "success" : "error"}>
            {metrics.contact.isPositive ? <ArrowUpIcon /> : <ArrowDownIcon className="text-error-500" />}
            {metrics.contact.percentage}%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Leads
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : metrics.lead.count.toLocaleString()}
            </h4>
          </div>

          <Badge color={metrics.lead.isPositive ? "success" : "error"}>
            {metrics.lead.isPositive ? <ArrowUpIcon /> : <ArrowDownIcon className="text-error-500" />}
            {metrics.lead.percentage}%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
