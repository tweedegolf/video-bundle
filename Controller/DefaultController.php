<?php

namespace TweedeGolf\VideoBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\HttpFoundation\JsonResponse;
use Madcoda\Youtube;
use TweedeGolf\VideoBundle\Entity\Video;

/**
 * Class DefaultController.
 *
 * @Route("/admin/video")
 */
class DefaultController extends Controller
{
    /**
     * @return JsonResponse
     *
     * @Route("/list")
     */
    public function listAction()
    {
        $videos = $this->getDoctrine()->getRepository('TGVideoBundle:Video')->findAll([], ['createdAt' => 'DESC']);

        $serializer = new Serializer([$this->get('tg_video.normalizer')]);

        return new JsonResponse([
            'videos' => $serializer->normalize($videos)
        ]);
    }

   /**
     * @return JsonResponse
     *
     * @Route("/sync")
     */
    public function syncAction()
    {
        $youtube = new Youtube(['key' => $this->getParameter('youtube_api_key')]);
        $videos = $youtube->getPlaylistItemsByPlaylistId($this->getParameter('youtube_playlist_id'));
        $em = $this->getDoctrine()->getManager();

        foreach ($videos as $video) {
            $name = $video->snippet->title;
            $thumbnail = $video->snippet->thumbnails->default->url;
            $youtubeId = $video->snippet->resourceId->videoId;
            $description = $video->snippet->description;

            $video = $em->getRepository('TGVideoBundle:Video')->findOneByYoutubeId($youtubeId);
            if ($video === null) {
                $video = new Video();
                $video->setYoutubeId($youtubeId);
                $em->persist($video);
            }

            $video->setName($name);
            $video->setDescription($description);
            $video->setThumbnail($thumbnail);
            $video->setUrl('https://www.youtube.com/embed/' . $youtubeId);
        }

        $em->flush();

        $videos = $this->getDoctrine()->getRepository('TGVideoBundle:Video')->findAll([], ['createdAt' => 'DESC']);
        $serializer = new Serializer([$this->get('tg_video.normalizer')]);

        return new JsonResponse([
            'videos' => $serializer->normalize($videos)
        ]);
    }
}
