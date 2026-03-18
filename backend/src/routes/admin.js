const express = require("express");
const router = express.Router();

const supabase = require("../config/supabaseClient");
const authMiddleware = require("../middleware/auth");

/**
 * @openapi
 * tags:
 *   - name: Admin
 *     description: Yönetim ve istatistikler
 */

/**
 * @openapi
 * /api/admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Admin istatistikleri
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: İstatistikler
 *       401:
 *         description: Yetkisiz
 *       500:
 *         description: Sunucu hatası
 */
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    // TODO: İleride sadece admin rolü için kısıtlanabilir.

    // Toplam kullanıcı sayısı: profiles tablosu
    const { count: totalUsers, error: usersCountError } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true });

    if (usersCountError) throw usersCountError;

    // Toplam topluluk sayısı
    const { count: totalCommunities, error: communitiesCountError } = await supabase
      .from("communities")
      .select("id", { count: "exact", head: true });

    if (communitiesCountError) throw communitiesCountError;

    // Toplam etkinlik sayısı
    const { count: totalEvents, error: eventsCountError } = await supabase
      .from("events")
      .select("id", { count: "exact", head: true });

    if (eventsCountError) throw eventsCountError;

    // Most Popular Events: participant sayısına göre ilk 3
    const { data: participantRows, error: participantRowsError } = await supabase
      .from("event_participants")
      .select("event_id");

    if (participantRowsError) throw participantRowsError;

    const eventParticipantCount = new Map();
    (participantRows || []).forEach((row) => {
      if (!row.event_id) return;
      const key = String(row.event_id);
      eventParticipantCount.set(key, (eventParticipantCount.get(key) || 0) + 1);
    });

    const topEvents = [...eventParticipantCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const topEventIds = topEvents.map(([eventId]) => eventId);

    let mostPopularEvents = [];
    if (topEventIds.length > 0) {
      const { data: eventRows, error: eventRowsError } = await supabase
        .from("events")
        .select("id, title")
        .in("id", topEventIds);

      if (eventRowsError) throw eventRowsError;

      const titleById = new Map(
        (eventRows || []).map((e) => [String(e.id), e.title])
      );

      mostPopularEvents = topEvents.map(([eventId, participantCount]) => ({
        event_id: eventId,
        title: titleById.get(eventId) || null,
        participant_count: participantCount,
      }));
    }

    // Active Communities: etkinlik sayısına göre (top 5)
    const { data: eventsRowsForCommunities, error: eventsRowsError } =
      await supabase.from("events").select("id, community_id");

    if (eventsRowsError) throw eventsRowsError;

    const communityEventCount = new Map();
    (eventsRowsForCommunities || []).forEach((row) => {
      if (!row.community_id) return;
      const key = String(row.community_id);
      communityEventCount.set(key, (communityEventCount.get(key) || 0) + 1);
    });

    const topCommunities = [...communityEventCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const topCommunityIds = topCommunities.map(([communityId]) => communityId);

    let activeCommunities = [];
    if (topCommunityIds.length > 0) {
      const { data: communityRows, error: communityRowsError } = await supabase
        .from("communities")
        .select("id, name")
        .in("id", topCommunityIds);

      if (communityRowsError) throw communityRowsError;

      const nameById = new Map(
        (communityRows || []).map((c) => [String(c.id), c.name])
      );

      activeCommunities = topCommunities.map(
        ([communityId, eventsCount]) => ({
          community_id: communityId,
          name: nameById.get(communityId) || null,
          events_count: eventsCount,
        })
      );
    }

    return res.json({
      totalUsers: totalUsers ?? 0,
      totalCommunities: totalCommunities ?? 0,
      totalEvents: totalEvents ?? 0,
      mostPopularEvents,
      activeCommunities,
    });
  } catch (error) {
    return res.status(500).json({ error: "Admin istatistikleri alınamadı." });
  }
});

module.exports = router;

