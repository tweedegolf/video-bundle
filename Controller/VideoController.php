<?php

namespace TweedeGolf\VideoBundle\Controller;

use Doctrine\DBAL\Exception\ForeignKeyConstraintViolationException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use TweedeGolf\VideoBundle\Entity\Video;

/**
 * Class VideoController.
 *
 * @Route("/admin/video")
 */
class VideoController extends Controller
{
    /**
     * @param Request $request
     *
     * @return JsonResponse
     *
     * @Route("/move/{id}", defaults={"id" = null})
     */
    public function indexAction(Request $request)
    {
        $video_ids = $request->get('videos', []);
        $videos = $this->getDoctrine()->getRepository('TGVideoBundle:Video')->findById($video_ids);

        return new JsonResponse([
            'videos' => $videos,
        ]);
    }
}
