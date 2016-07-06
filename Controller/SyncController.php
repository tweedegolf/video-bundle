<?php

namespace TweedeGolf\VideoBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

/**
 * Class SyncController.
 *
 * @Route("/admin/sync")
 */
class SyncController extends Controller
{
    /**
     * @Route("/sync")
     */
    public function syncAction()
    {
        $youtube = new Youtube(['key' => $this->getParameter('youtube_api_key')]);
        $videos = $youtube->getPlaylistItemsByPlaylistId($this->getParameter('youtube_playlist_id'));
        $this->em = $this->getDoctrine()->getManager();

        /*
          TODO: What if a video is removed from youtube? Cleanup?
        */

        foreach ($videos as $video) {
            $title = $video->snippet->title;
            $thumbnail = $video->snippet->thumbnails->default->url;
            $youtubeId = $video->snippet->resourceId->videoId;
            $description = $video->snippet->description;

            $video = $this->em->getRepository('TGVideoBundle:Video')->findOneByYoutubeId($youtubeId);
            if ($video === null) {
                $video = new Video();
                $video->setYoutubeId($youtubeId);
                $this->em->persist($video);
            }

            $video->setTitle($title);
            $video->setDescription($description);
            $video->setThumbnail($thumbnail);
        }

        $this->em->flush();

        return $this->render('TGVideoBundle:Default:index.html.twig', [
            'templates' => $this->getParameter('tg_video.templates'),
        ]);
    }
}
